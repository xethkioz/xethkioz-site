import { useMemo, useState } from 'react'
import { greenNodeCommands, greenNodeProtocol } from '../lib/networkBlueprint'

const defaultHistory = [
  'xethkioz green node console v0.1',
  'type: whoami · sudo truth · matrix · 42 · wisp · ubuntu · protocol',
]

export default function GreenNodeCommandConsole() {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>(defaultHistory)

  const commandMap = useMemo(() => {
    return new Map(greenNodeCommands.map((item) => [item.input.toLowerCase(), item.output]))
  }, [])

  const runCommand = (value: string) => {
    const normalized = value.trim().toLowerCase()
    if (!normalized) return

    if (normalized === 'clear') {
      setHistory(defaultHistory)
      return
    }

    if (normalized === 'protocol') {
      setHistory((current) => [
        ...current,
        `$ ${value}`,
        ...greenNodeProtocol.map((line) => `• ${line}`),
      ])
      return
    }

    const output = commandMap.get(normalized) || [
      'command not found',
      'available: whoami · sudo truth · matrix · 42 · wisp · ubuntu · protocol · clear',
    ]

    setHistory((current) => [...current, `$ ${value}`, ...output])
  }

  return (
    <section className="rounded-3xl border border-green-400/25 bg-black/75 p-5 shadow-[0_0_42px_rgba(0,255,102,.14)]" aria-labelledby="green-console-title">
      <div className="mb-4 flex items-center gap-2 border-b border-green-400/20 pb-3">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.22em] text-green-500">interactive terminal</span>
      </div>
      <h2 id="green-console-title" className="sr-only">Terminal interactiva Green Node</h2>
      <div className="min-h-[240px] space-y-2 overflow-hidden rounded-2xl border border-green-400/10 bg-green-950/10 p-4 font-mono text-xs text-green-200 md:text-sm">
        {history.slice(-14).map((line, index) => (
          <p key={`${line}-${index}`} className={line.startsWith('$') ? 'text-green-300' : 'text-green-100/70'}>{line}</p>
        ))}
        <p className="text-green-400 animate-pulse">█</p>
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          runCommand(command)
          setCommand('')
        }}
      >
        <label htmlFor="green-node-command" className="sr-only">Comando Green Node</label>
        <input
          id="green-node-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="whoami"
          className="min-w-0 flex-1 rounded-xl border border-green-400/25 bg-black px-4 py-3 font-mono text-sm text-green-100 outline-none transition focus:border-green-300"
        />
        <button className="rounded-xl border border-green-300/35 bg-green-400/10 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-green-200 hover:bg-green-400/20" type="submit">
          run
        </button>
      </form>
    </section>
  )
}
