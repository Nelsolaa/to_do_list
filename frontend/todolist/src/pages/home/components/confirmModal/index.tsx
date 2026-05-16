import './index.css'

type ConfirmModalProps = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void | Promise<void>
}

function ConfirmModal(confirmModalProps: ConfirmModalProps) {
  const { title, message, confirmLabel = 'Apagar', cancelLabel = 'Cancelar', onCancel, onConfirm } = confirmModalProps

  return (
    <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <button className="confirm-modal__backdrop" type="button" aria-label="Cancelar" onClick={onCancel} />

      <section className="confirm-modal__content">
        <h2 id="confirm-modal-title">{title}</h2>
        <p>{message}</p>

        <div className="confirm-modal__actions">
          <button className="confirm-modal__cancel" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="confirm-modal__confirm" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
