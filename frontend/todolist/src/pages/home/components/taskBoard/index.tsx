import './index.css'

type Task = {
  id: number
  title: string
  description: string | null
  completed: boolean
}

type TaskList = {
  id: string
  title: string
  tasks: Task[]
}

type TaskBoardProps = {
  lists: TaskList[]
  allTasksCompleted: boolean
  filterValue: string
  activeFilter: string
  onAddList: () => void
  onEditList: (listId: string) => void
  onDeleteList: (listId: string) => void | Promise<void>
  onAddTask: (listId: string) => void
  onToggleTask: (listId: string, taskId: number) => void | Promise<void>
  onEditTask: (listId: string, taskId: number) => void
  onDeleteTask: (listId: string, taskId: number) => void | Promise<void>
  onFilterValueChange: (value: string) => void
  onApplyFilter: () => void
  onClearFilter: () => void
}

function TaskBoard(taskBoardProps: TaskBoardProps) {
  const {
    lists,
    allTasksCompleted,
    filterValue,
    activeFilter,
    onAddList,
    onEditList,
    onDeleteList,
    onAddTask,
    onToggleTask,
    onEditTask,
    onDeleteTask,
    onFilterValueChange,
    onApplyFilter,
    onClearFilter,
  } = taskBoardProps

  return (
    <section className="task-board" aria-label="Lista de tarefas">
      <div className="task-board__header">
        <div>
          <span className="task-board__eyebrow">Snoopy planner</span>
          <h1>Minhas tarefas</h1>
        </div>

        <button className="task-board__add-list" type="button" onClick={onAddList}>
          Nova lista
        </button>
      </div>

      {allTasksCompleted && (
        <div className="task-board__success" role="status">
          Parabens, todas as tarefas foram concluidas!
        </div>
      )}

      <form
        className="task-board__filter"
        onSubmit={(event) => {
          event.preventDefault()
          onApplyFilter()
        }}
      >
        <input
          value={filterValue}
          placeholder="Filtrar por nome"
          aria-label="Filtrar tarefas por nome"
          onChange={(event) => onFilterValueChange(event.target.value)}
        />
        <button type="submit">Filtrar</button>
        {activeFilter && (
          <button type="button" onClick={onClearFilter}>
            Limpar
          </button>
        )}
      </form>

      <div className="task-board__lists">
        {lists.map((list) => (
          <article className="task-list" key={list.id}>
            <header className="task-list__header">
              <h2>{list.title}</h2>

              <div className="task-list__actions">
                <button type="button" onClick={() => onAddTask(list.id)}>
                  Adicionar
                </button>
                <button type="button" onClick={() => onEditList(list.id)}>
                  Editar
                </button>
                <button type="button" onClick={() => onDeleteList(list.id)}>
                  Deletar
                </button>
              </div>
            </header>

            {list.tasks.length === 0 || allTasksCompleted ? (
              <p className="task-list__empty">
                {allTasksCompleted ? 'Lista vazia por hoje.' : 'Nenhuma tarefa pendente.'}
              </p>
            ) : (
              <ul className="task-list__items">
                {list.tasks.map((task) => (
                  <li className={task.completed ? 'task-item task-item--completed' : 'task-item'} key={task.id}>
                    <button
                      className="task-item__check"
                      type="button"
                      aria-label="Marcar tarefa como concluida"
                      onClick={() => onToggleTask(list.id, task.id)}
                    >
                      {task.completed ? 'ok' : ''}
                    </button>

                    <span className="task-item__title">{task.title}</span>

                    <div className="task-item__actions">
                      <button type="button" onClick={() => onEditTask(list.id, task.id)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => onDeleteTask(list.id, task.id)}>
                        Deletar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default TaskBoard
