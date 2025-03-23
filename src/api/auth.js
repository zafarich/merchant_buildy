import { api } from 'src/boot/axios'
const auth = 'api/v1/login'

export async function login(payload) {
  const res = await api.post('api/v1/login', payload, {
    pass: true,
  })
  return res
}
export async function logOut() {
  const res = await api.post(auth + '/logout', {
    pass: true,
  })
  return res
}
export async function me() {
  const { data } = await api.post(auth + '/user', {
    pass: true,
  })
  return data
}
