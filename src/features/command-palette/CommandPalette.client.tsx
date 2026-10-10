'use client'

import { useRouter } from 'next/navigation'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { emitGameEvent } from '@/lib/game-events'
import { toggleTheme } from '@/features/theme'
import { Button, Kbd, PixelIcon } from '@/ui'
import { buildCommands, filterCommands, type Command } from './commands'
import styles from './CommandPalette.module.css'

const noopSubscribe = () => () => {}
const modifierKey = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl')

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

function groupCommands(commands: readonly Command[]) {
  const groups = new Map<Command['group'], Command[]>()
  for (const command of commands)
    groups.set(command.group, [...(groups.get(command.group) ?? []), command])
  return [...groups]
}

/**
 * The spellbook: Ctrl/⌘ K or "/" opens a searchable list of every page,
 * quest and action. A native <dialog> handles focus trapping and Escape; the
 * input and list follow the ARIA combobox pattern.
 */
export function CommandPalette() {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const modifier = useSyncExternalStore(noopSubscribe, modifierKey, () => 'Ctrl')

  const commands = useMemo(() => buildCommands(), [])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [notice, setNotice] = useState('')
  const results = useMemo(() => filterCommands(commands, query), [commands, query])

  function open() {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    setQuery('')
    setActive(0)
    setNotice('')
    dialog.showModal()
    inputRef.current?.focus()
    emitGameEvent('palette:open')
  }

  function close() {
    dialogRef.current?.close()
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const combo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      const slash = event.key === '/' && !isTyping(event.target)
      if (!combo && !slash) return
      event.preventDefault()
      if (dialogRef.current?.open) close()
      else open()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  async function run(command: Command) {
    const { action } = command
    switch (action.kind) {
      case 'navigate':
        close()
        router.push(action.href)
        return
      case 'external':
        close()
        window.open(action.href, '_blank', 'noopener,noreferrer')
        return
      case 'download': {
        close()
        const link = document.createElement('a')
        link.href = action.href
        link.download = ''
        link.click()
        emitGameEvent('cv:download')
        return
      }
      case 'theme':
        toggleTheme()
        close()
        return
      case 'copy':
        try {
          await navigator.clipboard.writeText(action.text)
          setNotice(action.done)
        } catch {
          setNotice(`Copy failed — it is ${action.text}`)
        }
        return
    }
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const command = results[active]
      if (command) void run(command)
    }
  }

  const groups = groupCommands(results)
  const activeCommand = results[active]
  const optionId = (command: Command) => `${listId}-${command.id}`

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={open}
        aria-label="Open command palette"
        aria-haspopup="dialog"
      >
        <PixelIcon name="quill" size={16} />
        <span className={styles.triggerKeys} aria-hidden>
          <Kbd>{modifier}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Command palette"
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className={styles.panel}>
          <div className={styles.search}>
            <PixelIcon name="quill" size={18} className={styles.searchIcon} />
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={activeCommand ? optionId(activeCommand) : undefined}
              aria-autocomplete="list"
              placeholder="Cast a command: page, quest, action…"
              value={query}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onInputKeyDown}
            />
            <Kbd>Esc</Kbd>
          </div>

          <div id={listId} role="listbox" aria-label="Commands" className={styles.list}>
            {results.length === 0 ? <p className={styles.empty}>No spell by that name.</p> : null}
            {groups.map(([group, items]) => (
              <div key={group} role="group" aria-label={group} className={styles.group}>
                <p className={styles.groupLabel} aria-hidden>
                  {group}
                </p>
                {items.map((command) => {
                  const selected = command === activeCommand
                  return (
                    <div
                      key={command.id}
                      id={optionId(command)}
                      role="option"
                      aria-selected={selected}
                      className={styles.option}
                      onMouseMove={() => setActive(results.indexOf(command))}
                      onClick={() => void run(command)}
                    >
                      {command.label}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <p className={styles.footer} role="status">
            {notice || (
              <>
                <Kbd>↑</Kbd> <Kbd>↓</Kbd> to choose · <Kbd>Enter</Kbd> to cast
              </>
            )}
          </p>
        </div>
      </dialog>
    </>
  )
}
