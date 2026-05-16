import { apiRequest, setAccessToken } from './api'

type Usuario = {
  id: number
  username: string
}

type TokenResponse = {
  access_token: string
  token_type: string
}

type AuthPayload = {
  username: string
  password: string
}

export async function createUser(authPayload: AuthPayload) {
  return apiRequest<Usuario>('/usuarios/', {
    method: 'POST',
    body: authPayload,
  })
}

export async function loginUser(authPayload: AuthPayload) {
  const tokenResponse = await apiRequest<TokenResponse>('/usuarios/login', {
    method: 'POST',
    body: authPayload,
  })

  setAccessToken(tokenResponse.access_token)

  return tokenResponse
}
