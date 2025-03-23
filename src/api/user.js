import { api } from 'src/boot/axios'

const urls = {
  admins: '/api/v1/admins',
  managers: '/api/v1/managers',
  planners: 'api/admin/planners',
  employees: 'api/admin/employees',
}

export async function fetch(params, user_type) {
  const { data } = await api(urls?.[user_type], { params })
  return data
}

export async function create(payload, user_type) {
  const res = await api.post(urls?.[user_type], payload, {
    pass: true,
  })
  return res
}

export async function update(id, payload, user_type) {
  const res = await api.post(`${urls?.[user_type]}/${id}`, payload, {
    pass: true,
  })
  return res
}

export async function getById(id, user_type) {
  const { data } = await api(`${urls?.[user_type]}/${id}`)
  return data
}
export async function deleteById(id, user_type) {
  const res = await api.delete(`${urls?.[user_type]}/${id}`)
  return res
}
export async function changeBlockStatus(id, payload, user_type) {
  const res = await api.post(`${urls?.[user_type]}/toggleUserBlock/${id}`, payload)
  return res
}
