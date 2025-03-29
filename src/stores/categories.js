import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from 'src/api/categories'

export const useCategoriesStore = defineStore('categories', () => {
  const all_count = ref(0)
  const fetch = async (params) => {
    const response = await api.fetch(params)
    all_count.value = response?.pagination?.total
    return response.data
  }

  const create = async (data) => {
    const response = await api.create(data)
    return response
  }

  const updateCategory = async (id, data) => {
    const response = await api.put(`/categories/${id}`, data)
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories.value[index] = response.data
    }
    return response.data
  }

  async function deleteById(id) {
    const res = await api.deleteById(id)
    return res
  }

  return {
    fetch,
    create,
    updateCategory,
    deleteById,
    all_count,
  }
})
