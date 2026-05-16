import snoopyHappy from '../../../../images/snoopy_feliz.gif'
import snoopyNormal from '../../../../images/snoopy_normal.gif'
import snoopySad from '../../../../images/snoopy_triste.gif'
import './index.css'

type SnoopyStatusProps = {
  completedTasks: number
  totalTasks: number
}

function SnoopyStatus(snoopyStatusProps: SnoopyStatusProps) {
  const { completedTasks, totalTasks } = snoopyStatusProps

  const statusType =
    totalTasks > 0 && completedTasks === totalTasks ? 'happy' : completedTasks > 0 ? 'normal' : 'sad'

  const snoopyGif = statusType === 'happy' ? snoopyHappy : statusType === 'normal' ? snoopyNormal : snoopySad

  const statusText =
    statusType === 'happy'
      ? 'Tudo concluido'
      : statusType === 'normal'
        ? 'Em progresso'
        : 'Vamos comecar'

  return (
    <aside className="snoopy-status" aria-label="Status das tarefas">
      <img className={`snoopy-status__gif snoopy-status__gif--${statusType}`} src={snoopyGif} alt={statusText} />
      <strong className="snoopy-status__label">{statusText}</strong>
    </aside>
  )
}

export default SnoopyStatus
