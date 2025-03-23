import { api } from 'src/boot/axios'

export async function login(payload) {
  const res = await api.post('api/v1/login', payload, {
    pass: true,
  })
  return res
}
export async function logOut() {
  const res = await api.post('api/v1/logout', {
    pass: true,
  })
  return res
}
export async function me() {
  const { data } = await api.post('api/v1/me', {
    pass: true,
  })
  return data
}
