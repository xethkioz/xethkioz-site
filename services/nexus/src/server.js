import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const PORT = Number(process.env.PORT || 10000)
const ORIGINS = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,https://xethkioz.com.ar,https://www.xethkioz.com.ar').split(',').map((item) => item.trim()).filter(Boolean)
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 420)
const HISTORY_LIMIT = Number(process.env.HISTORY_LIMIT || 80)
const rooms = new Map()
const cooldown = new Map()

const app = express()
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: ORIGINS, methods: ['GET', 'POST'] }))
app.use(express.json({ limit: '32kb' }))
app.use(rateLimit({ windowMs: 60_000, limit: 120 }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'xethkioz-nexus', rooms: rooms.size, uptime: process.uptime() })
})

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: ORIGINS, methods: ['GET', 'POST'] },
  maxHttpBufferSize: 8192,
  pingInterval: 25_000,
  pingTimeout: 20_000,
})

function cleanText(value, limit = MAX_MESSAGE_LENGTH) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, '').replace(/[<>]/g, '').trim().slice(0, limit)
}

function cleanNickname(value) {
  return cleanText(value, 20).replace(/[^\p{L}\p{N}_\-. ]/gu, '') || 'Visitante'
}

function cleanRoom(value) {
  const room = cleanText(value, 32).toLowerCase()
  return ['global', 'gaming', 'tech', 'green-zone'].includes(room) ? room : 'global'
}

function pushMessage(message) {
  const history = rooms.get(message.room) || []
  const next = [...history, message].slice(-HISTORY_LIMIT)
  rooms.set(message.room, next)
  io.to(message.room).emit('nexus:message', message)
}

function makeMessage({ room, nickname, text, type = 'user', translatedText }) {
  return {
    id: `nexus-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    room,
    nickname,
    text,
    translatedText,
    type,
    createdAt: new Date().toISOString(),
  }
}

io.on('connection', (socket) => {
  socket.on('nexus:join', (payload = {}) => {
    const room = cleanRoom(payload.room)
    const nickname = cleanNickname(payload.nickname)
    socket.data.room = room
    socket.data.nickname = nickname
    socket.join(room)
    socket.emit('nexus:history', { room, messages: rooms.get(room) || [] })
  })

  socket.on('nexus:message', async (payload = {}) => {
    const now = Date.now()
    const last = cooldown.get(socket.id) || 0
    if (now - last < 900) {
      socket.emit('nexus:error', { message: 'Esperá un segundo antes de enviar otro mensaje.' })
      return
    }
    cooldown.set(socket.id, now)

    const room = cleanRoom(payload.room || socket.data.room)
    const nickname = cleanNickname(payload.nickname || socket.data.nickname)
    const text = cleanText(payload.text)
    if (!text) return

    const translatedText = await translateSafely(text)
    pushMessage(makeMessage({ room, nickname, text, translatedText }))

    if (text.toLowerCase().startsWith('/ai ') || text.toLowerCase().startsWith('/nexus ')) {
      const answer = await askNexusBot(text.replace(/^\/(ai|nexus)\s+/i, ''))
      pushMessage(makeMessage({ room, nickname: 'NEXUS BOT', text: answer, type: 'bot' }))
    }
  })

  socket.on('disconnect', () => {
    cooldown.delete(socket.id)
  })
})

async function translateSafely(text) {
  if (process.env.TRANSLATION_PROVIDER === 'disabled') return undefined
  const sourceLang = detectLanguage(text)
  const targetLang = sourceLang === 'es' ? 'en' : 'es'
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    const response = await fetchWithTimeout(url, { method: 'GET' }, 5000)
    if (!response.ok) return undefined
    const data = await response.json()
    const translated = cleanText(data?.responseData?.translatedText || '', 420)
    return translated && translated.toLowerCase() !== text.toLowerCase() ? translated : undefined
  } catch {
    return undefined
  }
}

function detectLanguage(text) {
  if (/[áéíóúñ¿¡]/i.test(text)) return 'es'
  if (/\b(hola|que|como|para|con|gracias|juego|noticia)\b/i.test(text)) return 'es'
  return 'en'
}

async function askNexusBot(prompt) {
  const token = process.env.HUGGINGFACE_API_KEY
  const model = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3'
  if (!token) return 'Nexus Bot está instalado, pero falta configurar HUGGINGFACE_API_KEY.'
  const safePrompt = cleanText(prompt, 500)
  if (!safePrompt) return 'Mandame una consulta después del comando Nexus.'
  try {
    const response = await fetchWithTimeout(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: `Respondé breve, seguro y útil para la comunidad XETHKIOZ. Consulta: ${safePrompt}`,
        parameters: { max_new_tokens: 140, temperature: 0.6, return_full_text: false },
      }),
    }, 12_000)
    if (!response.ok) return 'Nexus Bot no pudo responder ahora. Revisá modelo/token.'
    const data = await response.json()
    const raw = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
    return cleanText(raw || 'Nexus Bot recibió la señal, pero no generó respuesta.', 650)
  } catch {
    return 'Nexus Bot está temporalmente fuera de línea.'
  }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

httpServer.listen(PORT, () => {
  console.log(`[XETHKIOZ Nexus] listening on ${PORT}`)
})
