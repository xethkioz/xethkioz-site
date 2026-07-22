export type SoundtrackId = 'power' | 'nu' | 'glam' | 'progressive' | 'industrial' | 'death'

export type SoundtrackProfile = {
  id: SoundtrackId
  label: string
  bpm: number
  root: number
  riff: number[]
  lead: number[]
}

const profiles: Record<SoundtrackId, SoundtrackProfile> = {
  power: { id: 'power', label: 'POWER METAL', bpm: 142, root: 82.41, riff: [0, 0, 7, 5, 0, 12, 10, 7, 0, 0, 5, 7, 10, 7, 5, 3], lead: [12, 14, 15, 19, 17, 15, 14, 12] },
  nu: { id: 'nu', label: 'NU METAL', bpm: 96, root: 61.74, riff: [0, 0, 0, 3, 0, 0, 6, 5, 0, 0, 0, 3, 8, 6, 5, 3], lead: [0, 3, 6, 5, 0, 8, 6, 3] },
  glam: { id: 'glam', label: 'GLAM METAL', bpm: 124, root: 73.42, riff: [0, 7, 10, 7, 0, 7, 12, 10, 5, 7, 10, 12, 10, 7, 5, 3], lead: [12, 15, 17, 19, 17, 15, 14, 12] },
  progressive: { id: 'progressive', label: 'PROG CYBER METAL', bpm: 118, root: 69.3, riff: [0, 7, 2, 9, 5, 12, 7, 3, 0, 10, 5, 2, 8, 3, 7, 12], lead: [12, 14, 19, 17, 15, 21, 19, 14] },
  industrial: { id: 'industrial', label: 'INDUSTRIAL METAL', bpm: 110, root: 65.41, riff: [0, 0, 6, 0, 3, 0, 8, 6, 0, 0, 6, 0, 10, 8, 6, 3], lead: [0, 6, 8, 6, 3, 10, 8, 6] },
  death: { id: 'death', label: 'BLACK / DEATH METAL', bpm: 168, root: 55, riff: [0, 1, 0, 6, 0, 1, 8, 6, 0, 1, 0, 10, 8, 6, 1, 0], lead: [12, 13, 18, 17, 13, 20, 18, 12] },
}

export function soundtrackForPath(pathname: string): SoundtrackProfile {
  if (pathname.startsWith('/gaming')) return profiles.nu
  if (pathname.startsWith('/fun')) return profiles.glam
  if (pathname.startsWith('/science')) return profiles.progressive
  if (pathname.startsWith('/green-node')) return profiles.death
  if (pathname.startsWith('/nexus-city')) return profiles.industrial
  return profiles.power
}

type AudioContextWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext
}

function distortionCurve(amount = 18) {
  const samples = 256
  const curve = new Float32Array(samples)
  for (let index = 0; index < samples; index += 1) {
    const x = (index * 2) / samples - 1
    curve[index] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

function frequency(root: number, semitones: number) {
  return root * Math.pow(2, semitones / 12)
}

export type ProceduralMetalPlayer = {
  start: () => Promise<void>
  stop: () => void
  setProfile: (profile: SoundtrackProfile) => void
}

export function createProceduralMetalPlayer(initialProfile: SoundtrackProfile): ProceduralMetalPlayer {
  let profile = initialProfile
  let context: AudioContext | null = null
  let master: GainNode | null = null
  let timer: number | null = null
  let nextStepAt = 0
  let step = 0

  const scheduleTone = (at: number, semitones: number, length: number, lead = false) => {
    if (!context || !master) return
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    const drive = context.createWaveShaper()
    oscillator.type = lead ? 'square' : 'sawtooth'
    oscillator.frequency.setValueAtTime(frequency(profile.root, semitones + (lead ? 12 : 0)), at)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(lead ? 2100 : 820, at)
    filter.Q.setValueAtTime(lead ? 3.5 : 1.3, at)
    drive.curve = distortionCurve(lead ? 7 : 22)
    drive.oversample = '2x'
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(lead ? 0.025 : 0.05, at + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length)
    oscillator.connect(filter).connect(drive).connect(gain).connect(master)
    oscillator.start(at)
    oscillator.stop(at + length + 0.03)
  }

  const scheduleKick = (at: number) => {
    if (!context || !master) return
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(125, at)
    oscillator.frequency.exponentialRampToValueAtTime(44, at + 0.12)
    gain.gain.setValueAtTime(0.12, at)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16)
    oscillator.connect(gain).connect(master)
    oscillator.start(at)
    oscillator.stop(at + 0.18)
  }

  const scheduleNoise = (at: number, hat: boolean) => {
    if (!context || !master) return
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.12), context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    source.buffer = buffer
    filter.type = 'highpass'
    filter.frequency.value = hat ? 6100 : 1500
    gain.gain.setValueAtTime(hat ? 0.012 : 0.045, at)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + (hat ? 0.045 : 0.11))
    source.connect(filter).connect(gain).connect(master)
    source.start(at)
  }

  const scheduler = () => {
    if (!context) return
    const stepLength = 60 / profile.bpm / 4
    while (nextStepAt < context.currentTime + 0.18) {
      const riffStep = step % profile.riff.length
      scheduleTone(nextStepAt, profile.riff[riffStep], stepLength * 0.88)
      if (riffStep % 2 === 0) scheduleNoise(nextStepAt, true)
      if (riffStep % 4 === 0) scheduleKick(nextStepAt)
      if (riffStep % 8 === 4) scheduleNoise(nextStepAt, false)
      if (riffStep % 4 === 2) scheduleTone(nextStepAt, profile.lead[(riffStep / 2) % profile.lead.length], stepLength * 1.6, true)
      step += 1
      nextStepAt += stepLength
    }
  }

  return {
    async start() {
      if (context) return
      const AudioContextCtor = window.AudioContext || (window as AudioContextWindow).webkitAudioContext
      if (!AudioContextCtor) throw new Error('Web Audio no está disponible en este navegador.')
      context = new AudioContextCtor()
      master = context.createGain()
      master.gain.value = 0.28
      master.connect(context.destination)
      nextStepAt = context.currentTime + 0.04
      await context.resume()
      scheduler()
      timer = window.setInterval(scheduler, 90)
    },
    stop() {
      if (timer !== null) window.clearInterval(timer)
      timer = null
      const activeContext = context
      context = null
      master = null
      if (activeContext && activeContext.state !== 'closed') void activeContext.close()
    },
    setProfile(nextProfile) {
      profile = nextProfile
      step = 0
      if (context) nextStepAt = context.currentTime + 0.08
    },
  }
}
