import { api } from 'src/boot/axios'
const url = 'api/v1/transaction-categories'

export async function fetch(params) {
  console.log('TEEEST', params)

  const res = await api(url, { params })
  return res?.data
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
