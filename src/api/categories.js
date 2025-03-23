import { api } from 'src/boot/axios'
const url = 'api/admin/users'

export async function fetch(params) {
  const { data } = await api(url, { params })
  return data
}

export async function create(payload) {
  const res = await api.post(url, payload, {
    pass: true,
  })
  return res
}

export async function update(id, payload) {
  const res = await api.post(`${url}/${id}`, payload, {
    pass: true,
  })
  return res
}

export async function getById(id) {
  const { data } = await api(`${url}/${id}`)
  return data
}
export async function deleteById(id) {
  const res = await api.delete(`${url}/${id}`)
  return res
}
export async function changeBlockStatus(id, payload) {
  const res = await api.post(`${url}/toggleUserBlock/${id}`, payload)
  return res
}
