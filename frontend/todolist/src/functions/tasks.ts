import { apiRequest } from './api'

export type ApiTask = {
  id: number
  usuario_id: number
  titulo: string
  descricao: string | null
  concluida: boolean
  criada_em: string
}

export type ApiTaskPayload = {
  titulo: string
  descricao: string | null
  concluida: boolean
}

export function listTasks() {
  return apiRequest<ApiTask[]>('/tarefas/', {
    auth: true,
  })
}

export function createTask(apiTaskPayload: ApiTaskPayload) {
  return apiRequest<ApiTask>('/tarefas/', {
    method: 'POST',
    auth: true,
    body: apiTaskPayload,
  })
}

export function updateTask(taskId: number, apiTaskPayload: ApiTaskPayload) {
  return apiRequest<ApiTask>(`/tarefas/${taskId}`, {
    method: 'PUT',
    auth: true,
    body: apiTaskPayload,
  })
}
export function searchTask(taskId: number, apiTaskPayload: ApiTaskPayload) {
  return apiRequest<ApiTask[]>(`/tarefas/${taskId}`, {
    method: 'GET',
    auth: true,
    body: apiTaskPayload,
  })
}
export function deleteTask(taskId: number) {
  return apiRequest<{ mensagem: string }>(`/tarefas/${taskId}`, {
    method: 'DELETE',
    auth: true,
  })
}
