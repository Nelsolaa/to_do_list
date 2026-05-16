const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'
const TOKEN_STORAGE_KEY = 'todolist_access_token'

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function hasAccessToken() {
  return Boolean(getAccessToken())
}

export async function apiRequest<ResponseData>(path: string, apiRequestOptions: ApiRequestOptions = {}) {
  const { method = 'GET', body, auth = false } = apiRequestOptions
  const headers = new Headers()

  headers.set('Content-Type', 'application/json')

  if (auth) {
    const token = getAccessToken()

    if (!token) {
      throw new ApiError('Token de acesso nao encontrado.', 401)
    }

    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type')
  const responseBody = contentType?.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken()
    }

    const detail = responseBody?.detail ?? responseBody?.mensagem ?? 'Erro ao chamar a API.'

    throw new ApiError(detail, response.status)
  }

  return responseBody as ResponseData
}
