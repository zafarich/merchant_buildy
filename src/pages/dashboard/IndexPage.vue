<template>
  <div>
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <!-- Vaqt filtri -->
      <div>
        <div class="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            v-for="option in timeFilterOptions"
            :key="option.value"
            class="py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            :class="
              timeFilter === option.value
                ? 'bg-white shadow text-primary'
                : 'text-gray-600 hover:bg-gray-50'
            "
            @click="handleTimeFilterChange(option.value)"
          >
            {{ option.label }}
          </button>
          <button
            class="py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            :class="
              timeFilter === 'custom'
                ? 'bg-white shadow text-primary'
                : 'text-gray-600 hover:bg-gray-50'
            "
            @click="openDateRangeModal"
          >
            {{ customDateLabel }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sana tanlash modali -->
    <q-dialog v-model="showDateModal">
      <q-card class="p-4 rounded-xl" style="min-width: 300px">
        <div class="text-lg font-medium mb-4">Vaqt oralig'ini tanlang</div>

        <q-date v-model="dateRange" range class="range-calendar" />

        <div class="flex justify-end gap-2 mt-4">
          <q-btn flat label="Bekor qilish" color="gray" v-close-popup />
          <q-btn unelevated color="primary" label="Tasdiqlash" @click="handleCustomDateSelect" />
        </div>
      </q-card>
    </q-dialog>

    <!-- Umumiy statistika -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="base-card p-4">
        <div class="text-gray-600 mb-2">Kirimlar</div>
        <div class="text-2xl font-bold text-green-600">{{ formatMoney(totalIncome) }}</div>
      </div>

      <div class="base-card p-4">
        <div class="text-gray-600 mb-2">Chiqimlar</div>
        <div class="text-2xl font-bold text-red-600">{{ formatMoney(totalExpense) }}</div>
      </div>

      <div class="base-card p-4">
        <div class="text-gray-600 mb-2">Foyda</div>
        <div class="text-2xl font-bold" :class="profit >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatMoney(profit) }}
        </div>
      </div>
    </div>

    <!-- Kategoriyalar bo'yicha statistika -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="base-card p-4">
        <div class="text-lg font-medium mb-4">Kategoriyalar bo'yicha kirimlar</div>
        <div class="space-y-3">
          <div
            v-for="category in incomeCategories"
            :key="category.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>{{ category.name }}</span>
            </div>
            <span class="font-medium">{{ formatMoney(category.amount) }}</span>
          </div>
        </div>
      </div>

      <div class="base-card p-4">
        <div class="text-lg font-medium mb-4">Kategoriyalar bo'yicha chiqimlar</div>
        <div class="space-y-3">
          <div
            v-for="category in expenseCategories"
            :key="category.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
              <span>{{ category.name }}</span>
            </div>
            <span class="font-medium">{{ formatMoney(category.amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Menegerlar balansi -->
    <div class="base-card p-4 mb-6">
      <div class="text-lg font-medium mb-4">Menegerlar balansi</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="manager in managers" :key="manager.id" class="p-4 border rounded-xl">
          <div class="flex items-center mb-3">
            <q-avatar color="primary" text-color="white" size="32px">
              {{ manager.initials }}
            </q-avatar>
            <div class="ml-3">
              <div class="font-medium">{{ manager.name }}</div>
              <div class="text-sm text-gray-600">Meneger</div>
            </div>
          </div>
          <div class="font-bold mb-3">{{ formatMoney(manager.balance) }}</div>
          <div class="text-sm text-gray-600 mb-2">Oxirgi xarajatlar:</div>
          <div class="space-y-2">
            <div
              v-for="expense in manager.lastExpenses"
              :key="expense.id"
              class="text-sm flex justify-between"
            >
              <span>{{ expense.description }}</span>
              <span class="font-medium">{{ formatMoney(expense.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Oxirgi xarajatlar -->
    <div class="base-card p-4">
      <div class="text-lg font-medium mb-4">Oxirgi xarajatlar</div>
      <div class="space-y-3">
        <div
          v-for="expense in lastExpenses"
          :key="expense.id"
          class="flex items-center justify-between p-3 border rounded-lg"
        >
          <div>
            <div class="font-medium">{{ expense.description }}</div>
            <div class="text-sm text-gray-600">{{ expense.date }}</div>
          </div>
          <div class="text-red-600 font-medium">{{ formatMoney(expense.amount) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatMoney } from 'src/utils/helpers'

const timeFilter = ref('week')
const timeFilterOptions = [
  { label: 'Hafta', value: 'week' },
  { label: 'Oy', value: 'month' },
  { label: 'Yil', value: 'year' },
]

const showDateModal = ref(false)
const dateRange = ref({ from: '', to: '' })

const customDateLabel = computed(() => {
  if (timeFilter.value !== 'custom') return 'Boshqa'
  if (!dateRange.value.from || !dateRange.value.to) return 'Boshqa'
  return `${dateRange.value.from} - ${dateRange.value.to}`
})

// Bu yerda API dan keladigan ma'lumotlar uchun ref va computed propertylar
const totalIncome = ref(15000000)
const totalExpense = ref(12000000)
const profit = computed(() => totalIncome.value - totalExpense.value)

const incomeCategories = ref([
  { id: 1, name: 'Kategoriya 1', amount: 5000000 },
  { id: 2, name: 'Kategoriya 2', amount: 4000000 },
])

const expenseCategories = ref([
  { id: 1, name: 'Kategoriya 1', amount: 3000000 },
  { id: 2, name: 'Kategoriya 2', amount: 2500000 },
])

const managers = ref([
  {
    id: 1,
    name: 'Aziz Soliyev',
    initials: 'AS',
    balance: 1500000,
    lastExpenses: [
      { id: 1, description: 'Xarajat 1', amount: 200000 },
      { id: 2, description: 'Xarajat 2', amount: 150000 },
    ],
  },
  // Boshqa menegerlar...
])

const lastExpenses = ref([
  {
    id: 1,
    description: 'Xarajat tavsifi',
    amount: 500000,
    date: '2024-02-20',
  },
  // Boshqa xarajatlar...
])

function handleTimeFilterChange(value) {
  timeFilter.value = value
  fetchData()
}

function openDateRangeModal() {
  timeFilter.value = 'custom'
  showDateModal.value = true
}

function handleCustomDateSelect() {
  showDateModal.value = false
  fetchData()
}

// API dan ma'lumotlarni olish
async function fetchData() {
  // API calls
}
</script>

<style scoped>
@media (max-width: 768px) {
  .base-card {
    padding: 16px;
  }
}

.range-calendar {
  width: 100%;
}
</style>
