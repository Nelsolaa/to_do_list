import type { FormEvent } from 'react'
import { useState } from 'react'
import './index.css'

type TaskModalProps = {
  title: string
  placeholder: string
  submitLabel: string
  initialValue?: string
  onClose: () => void
  onSubmit: (value: string) => void | Promise<void>
}

function TaskModal(taskModalProps: TaskModalProps) {
  const { title, placeholder, submitLabel, initialValue = '', onClose, onSubmit } = taskModalProps
  const [value, setValue] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(trimmedValue)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <button className="task-modal__backdrop" type="button" aria-label="Fechar modal" onClick={onClose} />

      <form className="task-modal__content" onSubmit={handleSubmit}>
        <div className="task-modal__header">
          <h2 id="task-modal-title">{title}</h2>
          <button className="task-modal__close" type="button" aria-label="Fechar" onClick={onClose}>
            x
          </button>
        </div>

        <input
          className="task-modal__input"
          value={value}
          placeholder={placeholder}
          autoFocus
          onChange={(event) => setValue(event.target.value)}
        />

        <button className="task-modal__submit" type="submit">
          {isSubmitting ? 'Salvando...' : submitLabel}
        </button>
      </form>
    </div>
  )
}

export default TaskModal
