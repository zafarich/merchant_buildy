import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from 'src/api/categories'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])

  const fetchCategories = async () => {
    const response = await api.get('/categories')
    categories.value = response.data
  }

  const createCategory = async (data) => {
    const response = await api.post('/categories', data)
    categories.value.push(response.data)
    return response.data
  }

  const updateCategory = async (id, data) => {
    const response = await api.put(`/categories/${id}`, data)
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories.value[index] = response.data
    }
    return response.data
  }

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  return {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
