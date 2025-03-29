import { defineStore } from 'pinia'
import * as api from 'src/api/user'
import { ref } from 'vue-demi'

export const useUserStore = defineStore('user', () => {
  const all_count = ref(0)
  async function fetch(params, user_type) {
    const res = await api.fetch(params, user_type)
    all_count.value = res?.pagination?.total
    return res?.data
  }
  async function create(payload, user_type) {
    const res = await api.create(payload)
    return res
  }
  async function update(id, payload, user_type) {
    const res = await api.update(id, payload)
    return res
  }
  async function getById(id, user_type) {
    const res = await api.getById(id)
    return res?.result
  }
  async function changeBlockStatus(id, payload, user_type) {
    const res = await api.changeBlockStatus(id, payload)
    return res
  }
  async function deleteById(id, user_type) {
    const res = await api.deleteById(id)
    return res
  }

  return {
    fetch,
    create,
    getById,
    update,
    deleteById,
    all_count,
    changeBlockStatus,
  }
})
