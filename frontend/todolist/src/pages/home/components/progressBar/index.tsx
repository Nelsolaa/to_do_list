import './index.css'

type ProgressBarProps = {
  completedTasks: number
  totalTasks: number
}

function ProgressBar(progressBarProps: ProgressBarProps) {
  const { completedTasks, totalTasks } = progressBarProps
  const pendingTasks = totalTasks - completedTasks
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <section className="progress-card" aria-label="Progresso das tarefas">
      <div className="progress-card__header">
        <span>Progresso</span>
        <strong>{progress}%</strong>
      </div>

      <div className="progress-card__track">
        <div className="progress-card__bar" style={{ width: `${progress}%` }} />
      </div>

      <p className="progress-card__details">
        {completedTasks} concluidas / {pendingTasks} pendentes
      </p>
    </section>
  )
}

export default ProgressBar
