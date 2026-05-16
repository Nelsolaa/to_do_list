import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { clearAccessToken, hasAccessToken } from '../../functions/api'
import type { ApiTask } from '../../functions/tasks'
import {
  createTask as createApiTask,
  deleteTask as deleteApiTask,
  listTasks,
  updateTask as updateApiTask,
} from '../../functions/tasks'
import ConfirmModal from './components/confirmModal'
import ProgressBar from './components/progressBar'
import SnoopyClock from './components/snoopyClock'
import SnoopyStatus from './components/snoopyStatus'
import TaskBoard from './components/taskBoard'
import TaskModal from './components/taskModal'
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

type ModalConfig = {
  title: string
  placeholder: string
  submitLabel: string
  initialValue?: string
  initialDescription?: string | null
  descriptionPlaceholder?: string
  showDescription?: boolean
  onSubmit: (value: TaskModalValue) => void | Promise<void>
}

type ConfirmConfig = {
  title: string
  message: string
  onConfirm: () => void | Promise<void>
}

type TaskModalValue = {
  title: string
  description: string | null
}

const defaultList: TaskList = {
  id: 'list-1',
  title: 'Lista principal',
  tasks: [],
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function mapApiTask(apiTask: ApiTask): Task {
  return {
    id: apiTask.id,
    title: apiTask.titulo,
    description: apiTask.descricao,
    completed: apiTask.concluida,
  }
}

function Home() {
  const navigate = useNavigate()
  const [lists, setLists] = useState<TaskList[]>([defaultList])
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null)
  const [filterValue, setFilterValue] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!hasAccessToken()) {
      navigate('/login')
      return
    }

    let ignoreResult = false

    async function loadTasks() {
      try {
        const apiTasks = await listTasks()

        if (ignoreResult) {
          return
        }

        setLists([{ ...defaultList, tasks: apiTasks.map(mapApiTask) }])
      } catch (error) {
        if (ignoreResult) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel carregar as tarefas.')

        if (error instanceof Error && 'status' in error && error.status === 401) {
          navigate('/login')
        }
      }
    }

    void loadTasks()

    return () => {
      ignoreResult = true
    }
  }, [navigate])

  const allTasks = useMemo(() => lists.flatMap((list) => list.tasks), [lists])
  const visibleLists = useMemo(() => {
    const normalizedFilter = activeFilter.trim().toLowerCase()

    if (!normalizedFilter) {
      return lists
    }

    return lists.map((list) => ({
      ...list,
      tasks: list.tasks.filter((task) => {
        const searchableText = `${task.title} ${task.description ?? ''}`.toLowerCase()

        return searchableText.includes(normalizedFilter)
      }),
    }))
  }, [activeFilter, lists])
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter((task) => task.completed).length
  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks

  function openAddListModal() {
    setModalConfig({
      title: 'Nova lista',
      placeholder: 'Nome da lista',
      submitLabel: 'Criar lista',
      onSubmit: ({ title }) => {
        setLists((currentLists) => [
          ...currentLists,
          {
            id: createId('list'),
            title,
            tasks: [],
          },
        ])
      },
    })
  }

  function openEditListModal(listId: string) {
    const list = lists.find((currentList) => currentList.id === listId)

    if (!list) {
      return
    }

    setModalConfig({
      title: 'Editar lista',
      placeholder: 'Nome da lista',
      submitLabel: 'Salvar lista',
      initialValue: list.title,
      onSubmit: ({ title }) => {
        setLists((currentLists) =>
          currentLists.map((currentList) => (currentList.id === listId ? { ...currentList, title } : currentList)),
        )
      },
    })
  }

  function requestDeleteList(listId: string) {
    const list = lists.find((currentList) => currentList.id === listId)

    if (!list) {
      return
    }

    setConfirmConfig({
      title: 'Apagar lista?',
      message: `Tem certeza que deseja apagar "${list.title}" e todas as tarefas dentro dela?`,
      onConfirm: async () => {
        await deleteList(listId)
      },
    })
  }

  async function deleteList(listId: string) {
    const list = lists.find((currentList) => currentList.id === listId)

    if (!list) {
      return
    }

    try {
      setErrorMessage('')
      await Promise.all(list.tasks.map((task) => deleteApiTask(task.id)))
      setLists((currentLists) => currentLists.filter((currentList) => currentList.id !== listId))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel deletar a lista.')
    }
  }

  function openAddTaskModal(listId?: string) {
    const targetListId = listId ?? lists[0]?.id

    setModalConfig({
      title: 'Nova tarefa',
      placeholder: 'O que precisa ser feito?',
      descriptionPlaceholder: 'Descricao da tarefa (opcional)',
      showDescription: true,
      submitLabel: 'Adicionar tarefa',
      onSubmit: async ({ title, description }) => {
        if (!targetListId) {
          return
        }

        setErrorMessage('')

        const apiTask = await createApiTask({
          titulo: title,
          descricao: description,
          concluida: false,
        })
        const newTask = mapApiTask(apiTask)

        setLists((currentLists) =>
          currentLists.map((list) =>
            list.id === targetListId
              ? {
                  ...list,
                  tasks: [...list.tasks, newTask],
                }
              : list,
          ),
        )
      },
    })
  }

  async function toggleTask(listId: string, taskId: number) {
    const task = lists.flatMap((list) => list.tasks).find((currentTask) => currentTask.id === taskId)

    if (!task) {
      return
    }

    try {
      setErrorMessage('')

      const updatedTask = mapApiTask(
        await updateApiTask(taskId, {
          titulo: task.title,
          descricao: task.description,
          concluida: !task.completed,
        }),
      )

      setLists((currentLists) =>
        currentLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.map((currentTask) => (currentTask.id === taskId ? updatedTask : currentTask)),
              }
            : list,
        ),
      )
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel atualizar a tarefa.')
    }
  }

  function openEditTaskModal(listId: string, taskId: number) {
    const list = lists.find((currentList) => currentList.id === listId)
    const task = list?.tasks.find((currentTask) => currentTask.id === taskId)

    if (!task) {
      return
    }

    setModalConfig({
      title: 'Editar tarefa',
      placeholder: 'Nome da tarefa',
      submitLabel: 'Salvar tarefa',
      initialValue: task.title,
      initialDescription: task.description,
      descriptionPlaceholder: 'Descricao da tarefa (opcional)',
      showDescription: true,
      onSubmit: async ({ title, description }) => {
        setErrorMessage('')

        const updatedTask = mapApiTask(
          await updateApiTask(taskId, {
            titulo: title,
            descricao: description,
            concluida: task.completed,
          }),
        )

        setLists((currentLists) =>
          currentLists.map((currentList) =>
            currentList.id === listId
              ? {
                  ...currentList,
                  tasks: currentList.tasks.map((currentTask) =>
                    currentTask.id === taskId ? updatedTask : currentTask,
                  ),
                }
              : currentList,
          ),
        )
      },
    })
  }

  function requestDeleteTask(listId: string, taskId: number) {
    const task = lists.flatMap((list) => list.tasks).find((currentTask) => currentTask.id === taskId)

    if (!task) {
      return
    }

    setConfirmConfig({
      title: 'Apagar tarefa?',
      message: `Tem certeza que deseja apagar "${task.title}"?`,
      onConfirm: async () => {
        await deleteTask(listId, taskId)
      },
    })
  }

  async function deleteTask(listId: string, taskId: number) {
    try {
      setErrorMessage('')
      await deleteApiTask(taskId)

      setLists((currentLists) =>
        currentLists.map((list) =>
          list.id === listId ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) } : list,
        ),
      )
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel deletar a tarefa.')
    }
  }

  function logout() {
    clearAccessToken()
    navigate('/login')
  }

  function applyFilter() {
    setActiveFilter(filterValue)
  }

  function clearFilter() {
    setFilterValue('')
    setActiveFilter('')
  }

  return (
    <main className="home-page">
      <SnoopyStatus completedTasks={completedTasks} totalTasks={totalTasks} />
      <SnoopyClock />
      <ProgressBar completedTasks={completedTasks} totalTasks={totalTasks} />

      <section className="home-page__content">
        <div className="home-page__side-space" />

        <div className="home-page__main-column">
          {errorMessage && <p className="home-page__error">{errorMessage}</p>}

          <button className="home-page__logout" type="button" onClick={logout}>
            Sair
          </button>

          <TaskBoard
            lists={visibleLists}
            allTasksCompleted={allTasksCompleted}
            filterValue={filterValue}
            activeFilter={activeFilter}
            onAddList={openAddListModal}
            onEditList={openEditListModal}
            onDeleteList={requestDeleteList}
            onAddTask={openAddTaskModal}
            onToggleTask={toggleTask}
            onEditTask={openEditTaskModal}
            onDeleteTask={requestDeleteTask}
            onFilterValueChange={setFilterValue}
            onApplyFilter={applyFilter}
            onClearFilter={clearFilter}
          />
        </div>
      </section>

      {modalConfig && <TaskModal {...modalConfig} onClose={() => setModalConfig(null)} />}
      {confirmConfig && (
        <ConfirmModal
          title={confirmConfig.title}
          message={confirmConfig.message}
          onCancel={() => setConfirmConfig(null)}
          onConfirm={async () => {
            await confirmConfig.onConfirm()
            setConfirmConfig(null)
          }}
        />
      )}
    </main>
  )
}

export default Home
