import { useMemo, useState, type DragEvent } from 'react'
import { useLang } from '../../lib/LangContext'

export type CalendarColumnId = 'backlog' | 'today' | 'tomorrow' | 'week'
export type CalendarPriority = 'low' | 'medium' | 'high'

export interface CalendarAppointment {
  id: string
  title: string
  description: string
  dateKey: string
  columnId: CalendarColumnId
  startTime: string
  xp: number
  priority: CalendarPriority
  kind: 'content' | 'stream' | 'system' | 'community'
}

interface CalendarDragPayload extends CalendarAppointment {
  isExisting: true
}

interface NewCalendarItemPayload {
  isExisting: false
  title: string
  description: string
  kind: CalendarAppointment['kind']
  priority: CalendarPriority
  xp: number
}

const labels = {
  es: {
    eyebrow: 'Calendario operativo',
    title: 'XETHKIOZ Calendar Grid',
    description: 'Agenda editorial y de comunidad con Drag & Drop real, fechas reactivas y zonas de soltado habilitadas.',
    today: 'Hoy',
    prev: 'Día anterior',
    next: 'Día siguiente',
    newEvent: 'Nuevo evento',
    dragHint: 'Arrastrá una tarjeta entre columnas para reubicarla.',
    pool: 'Elementos nuevos',
    backlog: 'Backlog',
    todayColumn: 'Hoy',
    tomorrow: 'Mañana',
    week: 'Semana',
    empty: 'Sin elementos asignados',
    existingMoved: 'Evento reubicado',
    newCreated: 'Nuevo evento creado',
    currentDate: 'Fecha activa',
  },
  en: {
    eyebrow: 'Operational calendar',
    title: 'XETHKIOZ Calendar Grid',
    description: 'Editorial and community schedule with real Drag & Drop, reactive dates and enabled drop zones.',
    today: 'Today',
    prev: 'Previous day',
    next: 'Next day',
    newEvent: 'New event',
    dragHint: 'Drag a card between columns to relocate it.',
    pool: 'New items',
    backlog: 'Backlog',
    todayColumn: 'Today',
    tomorrow: 'Tomorrow',
    week: 'Week',
    empty: 'No items assigned',
    existingMoved: 'Event relocated',
    newCreated: 'New event created',
    currentDate: 'Active date',
  },
} as const

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10)

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const createInitialAppointments = (dateKey: string): CalendarAppointment[] => [
  {
    id: 'cal-001',
    title: 'World Gate QA',
    description: 'Revisar portales, HUD, Wisp y rutas principales antes de live.',
    dateKey,
    columnId: 'today',
    startTime: '10:00',
    xp: 80,
    priority: 'high',
    kind: 'system',
  },
  {
    id: 'cal-002',
    title: 'Nota Gaming',
    description: 'Preparar noticia para el News Engine con fuente y categoría.',
    dateKey,
    columnId: 'backlog',
    startTime: '12:30',
    xp: 45,
    priority: 'medium',
    kind: 'content',
  },
  {
    id: 'cal-003',
    title: 'Stream Ops',
    description: 'Bloque para revisar Kick/Twitch, escenas OBS y CTA del portal.',
    dateKey: formatDateKey(addDays(new Date(dateKey), 1)),
    columnId: 'tomorrow',
    startTime: '22:30',
    xp: 60,
    priority: 'medium',
    kind: 'stream',
  },
]

const newItems: NewCalendarItemPayload[] = [
  { isExisting: false, title: 'Artículo Mystery Lab', description: 'Crear pieza sobre evidencia, hipótesis y especulación.', kind: 'content', priority: 'medium', xp: 35 },
  { isExisting: false, title: 'Misión comunidad', description: 'Agregar misión de XP para usuarios activos.', kind: 'community', priority: 'low', xp: 25 },
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isCalendarPriority = (value: unknown): value is CalendarPriority =>
  value === 'low' || value === 'medium' || value === 'high'

const isCalendarKind = (value: unknown): value is CalendarAppointment['kind'] =>
  value === 'content' || value === 'stream' || value === 'system' || value === 'community'

const safeParsePayload = (raw: string): CalendarDragPayload | NewCalendarItemPayload | null => {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return null
    if (
      parsed.isExisting === true &&
      typeof parsed.id === 'string' &&
      typeof parsed.title === 'string' &&
      typeof parsed.description === 'string' &&
      typeof parsed.dateKey === 'string' &&
      (parsed.columnId === 'backlog' || parsed.columnId === 'today' || parsed.columnId === 'tomorrow' || parsed.columnId === 'week') &&
      typeof parsed.startTime === 'string' &&
      typeof parsed.xp === 'number' &&
      isCalendarPriority(parsed.priority) &&
      isCalendarKind(parsed.kind)
    ) {
      return {
        isExisting: true,
        id: parsed.id,
        title: parsed.title,
        description: parsed.description,
        dateKey: parsed.dateKey,
        columnId: parsed.columnId,
        startTime: parsed.startTime,
        xp: parsed.xp,
        priority: parsed.priority,
        kind: parsed.kind,
      } satisfies CalendarDragPayload
    }
    if (
      parsed.isExisting === false &&
      typeof parsed.title === 'string' &&
      typeof parsed.description === 'string' &&
      isCalendarKind(parsed.kind) &&
      isCalendarPriority(parsed.priority) &&
      typeof parsed.xp === 'number'
    ) {
      return {
        isExisting: false,
        title: parsed.title,
        description: parsed.description,
        kind: parsed.kind,
        priority: parsed.priority,
        xp: parsed.xp,
      } satisfies NewCalendarItemPayload
    }
    return null
  } catch {
    return null
  }
}

const columnLabels = (lang: keyof typeof labels): Record<CalendarColumnId, string> => ({
  backlog: labels[lang].backlog,
  today: labels[lang].todayColumn,
  tomorrow: labels[lang].tomorrow,
  week: labels[lang].week,
})

const columnDateKey = (baseDate: Date, columnId: CalendarColumnId) => {
  if (columnId === 'tomorrow') return formatDateKey(addDays(baseDate, 1))
  if (columnId === 'week') return formatDateKey(addDays(baseDate, 7))
  return formatDateKey(baseDate)
}

const priorityClasses: Record<CalendarPriority, string> = {
  low: 'border-violet-500/10 text-gray-300',
  medium: 'border-violet-400/25 text-violet-100',
  high: 'border-orange-400/40 text-orange-100',
}

export default function FusionCalendarGrid() {
  const { lang } = useLang()
  const ui = labels[lang]

  // Critical fix: currentDate and dateKey are real React state values.
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date())
  const [appointments, setAppointments] = useState<CalendarAppointment[]>(() => createInitialAppointments(formatDateKey(new Date())))
  const [lastAction, setLastAction] = useState<string>(ui.dragHint)

  const dateKey = useMemo(() => formatDateKey(currentDate), [currentDate])
  const cols = useMemo(() => columnLabels(lang), [lang])

  const onExistingDragStart = (event: DragEvent<HTMLElement>, appointment: CalendarAppointment) => {
    // Critical fix: isExisting: true is explicitly transferred.
    const payload: CalendarDragPayload = { ...appointment, isExisting: true }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/xethkioz-calendar', JSON.stringify(payload))
  }

  const onNewDragStart = (event: DragEvent<HTMLElement>, item: NewCalendarItemPayload) => {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/xethkioz-calendar', JSON.stringify(item))
  }

  const handleColumnDrop = (event: DragEvent<HTMLElement>, columnId: CalendarColumnId) => {
    event.preventDefault()
    const raw = event.dataTransfer.getData('application/xethkioz-calendar')
    const payload = safeParsePayload(raw)
    if (!payload) return

    const nextDateKey = columnDateKey(currentDate, columnId)

    if (payload.isExisting) {
      setAppointments((items) =>
        items.map((item) =>
          item.id === payload.id
            ? { ...item, columnId, dateKey: nextDateKey }
            : item,
        ),
      )
      setLastAction(`${ui.existingMoved}: ${payload.title}`)
      return
    }

    const created: CalendarAppointment = {
      id: `cal-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      dateKey: nextDateKey,
      columnId,
      startTime: '00:00',
      xp: payload.xp,
      priority: payload.priority,
      kind: payload.kind,
    }

    setAppointments((items) => [created, ...items])
    setLastAction(`${ui.newCreated}: ${created.title}`)
  }

  const moveDate = (days: number) => setCurrentDate((date) => addDays(date, days))
  const goToday = () => setCurrentDate(new Date())

  return (
    <section className="min-h-screen bg-[#0B0A0F] px-4 py-14 text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-violet-500/10 bg-[#16141F] p-5 shadow-2xl shadow-violet-950/20 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/80">{ui.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-100 sm:text-5xl">{ui.title}</h1>
              <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">{ui.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => moveDate(-1)} className="rounded-xl border border-violet-500/10 bg-[#0B0A0F] px-4 py-2 text-sm text-gray-200 transition hover:border-violet-400/40 focus:outline-none focus:ring-2 focus:ring-violet-400/40" aria-label={ui.prev}>−</button>
              <button type="button" onClick={goToday} className="rounded-xl border border-orange-400/40 bg-orange-500/15 px-4 py-2 text-sm font-bold text-orange-100 transition hover:bg-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-300/50">{ui.today}</button>
              <button type="button" onClick={() => moveDate(1)} className="rounded-xl border border-violet-500/10 bg-[#0B0A0F] px-4 py-2 text-sm text-gray-200 transition hover:border-violet-400/40 focus:outline-none focus:ring-2 focus:ring-violet-400/40" aria-label={ui.next}>+</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-violet-500/10 bg-[#0B0A0F] p-4">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500">{ui.currentDate}</span>
              <strong className="mt-1 block text-lg text-violet-100">{dateKey}</strong>
            </div>
            <div className="rounded-2xl border border-violet-500/10 bg-[#0B0A0F] p-4 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Status</span>
              <strong className="mt-1 block text-sm text-gray-200">{lastAction}</strong>
            </div>
          </div>
        </header>

        <aside className="rounded-3xl border border-violet-500/10 bg-[#16141F] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">{ui.pool}</h2>
            <span className="rounded-full border border-violet-500/10 px-3 py-1 text-xs text-gray-300">{ui.newEvent}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {newItems.map((item) => (
              <article
                key={item.title}
                draggable
                onDragStart={(event) => onNewDragStart(event, item)}
                className="cursor-grab rounded-2xl border border-violet-500/10 bg-[#0B0A0F] p-4 text-gray-200 transition hover:border-orange-400/35 hover:bg-orange-500/5 active:cursor-grabbing"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <strong>{item.title}</strong>
                  <span className="rounded-full border border-violet-500/10 px-2 py-1 text-xs text-violet-200">+{item.xp} XP</span>
                </div>
                <p className="text-sm leading-6 text-gray-400">{item.description}</p>
              </article>
            ))}
          </div>
        </aside>

        <div className="grid gap-4 lg:grid-cols-4">
          {(Object.keys(cols) as CalendarColumnId[]).map((columnId) => {
            const columnAppointments = appointments.filter((appointment) => appointment.columnId === columnId)
            return (
              <section
                key={columnId}
                // Critical fix: preventDefault enables native HTML5 drop.
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleColumnDrop(event, columnId)}
                className="min-h-[28rem] rounded-3xl border border-violet-500/10 bg-[#16141F] p-4 transition hover:border-violet-400/25 hover:shadow-2xl hover:shadow-violet-950/20"
                aria-label={cols[columnId]}
              >
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-violet-500/10 pb-3">
                  <div>
                    <h2 className="font-black text-gray-100">{cols[columnId]}</h2>
                    <p className="text-xs text-gray-500">{columnDateKey(currentDate, columnId)}</p>
                  </div>
                  <span className="rounded-full border border-violet-500/10 bg-violet-500/10 px-3 py-1 text-xs text-violet-100">{columnAppointments.length}</span>
                </div>

                <div className="space-y-3">
                  {columnAppointments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-violet-500/15 bg-[#0B0A0F] p-5 text-sm text-gray-500">{ui.empty}</div>
                  ) : null}

                  {columnAppointments.map((appointment) => (
                    <article
                      key={appointment.id}
                      draggable
                      onDragStart={(event) => onExistingDragStart(event, appointment)}
                      className={`cursor-grab rounded-2xl border bg-[#0B0A0F] p-4 transition hover:-translate-y-0.5 hover:border-violet-400/35 hover:bg-violet-500/5 focus-within:ring-2 focus-within:ring-violet-400/40 active:cursor-grabbing ${priorityClasses[appointment.priority]}`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <strong className="block text-gray-100">{appointment.title}</strong>
                          <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{appointment.kind} · {appointment.startTime}</span>
                        </div>
                        <span className="rounded-full border border-orange-400/25 bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-100">{appointment.xp} XP</span>
                      </div>
                      <p className="text-sm leading-6 text-gray-400">{appointment.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </section>
  )
}
