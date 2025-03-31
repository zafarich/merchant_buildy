<script setup>
import { nextTick, onMounted, ref } from 'vue-demi'
import { useRouter, useRoute } from 'vue-router'

import { formatPhoneNumber, isPermission, prettify } from 'src/utils/helpers'
import { TEXT_OBJ } from 'src/types/positionTypes'

import TheTable from 'src/components/table/TheTable.vue'
import TableActions from './table-cells/TableActions.vue'
import FullNameWithImage from './table-cells/FullNameWithImage.vue'
import AddEditUser from './modules/AddEditUser.vue'

import { useUserStore } from 'src/stores/user'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const loading = ref(false)
const data = ref([])
const query_status = route.query?.status?.toString()
const user_type = ref(/\b(active|block)\b/i?.test(query_status) ? query_status : 'active')
const tableBodyCells = [
  {
    component: FullNameWithImage,
    name: 'full_name',
  },
  {
    component: TableActions,
    name: '',
  },
]

const tableRef = ref(null)
const addEditRoleDialog = ref(false)
const editItem = ref(null)
const params = ref({
  status: user_type.value,
})

async function fetchData() {
  loading.value = true
  await nextTick()
  params.value = { ...params.value, ...tableRef.value.pagination }
  data.value = (await userStore.fetch(params.value, 'admins')) || []
  tableRef.value.rowsNumber = userStore.all_count
  tableRef.value.prepareHeaders()
  loading.value = false
}
onMounted(fetchData)

function replaceNewQuery(newQuery) {
  router.replace({
    query: {
      ...route.query,
      ...newQuery,
    },
  })
}
const tableSettings = {
  defaultColumnOrder: [
    'full_name',
    'position',
    'balance',
    'Salary_type',
    'Salary_amount',
    'Phone_number',
    '',
  ],
  formatColumns: {
    Phone_number: (v) => formatPhoneNumber(v),
    Salary_amount: (v) => `${prettify(v)} so'm`,
    balance: (v) => `${prettify(v)} so'm`,
  },
  fieldFormatColumns: {
    full_name: (row) => row,
    position: (row) => TEXT_OBJ[row?.position],
    Salary_type: (row) => (row.work_type === 'fixed' ? 'Oylikli' : 'Soatli'),
    Phone_number: (row) => row.user.phone,
    Salary_amount: (row) => (row.work_type === 'fixed' ? row?.monthly_salary : row?.hourly_rate),
  },
  mobileOrder: ['full_name', 'balance', 'position', 'Salary_type', 'Salary_amount', 'Phone_number'],
}

function addUserBtn() {
  editItem.value = null
  addEditRoleDialog.value = true
}
function resetFilterAndFetch() {
  resetFilter()
  fetchData()
}

function resetFilter() {
  tableRef.value.resetPagination()
  user_type.value = 'active'
}
function roleAddedOrChanged() {
  addEditRoleDialog.value = false
  resetFilterAndFetch()
}
function editData(data) {
  editItem.value = data
  addEditRoleDialog.value = true
}
function request(pagination) {
  params.value = { ...params.value, ...pagination }
  fetchData()
}
function changeStatus(status) {
  params.value = { ...params.value, status }
  replaceNewQuery({ status })
  fetchData()
}
</script>
<template>
  <div>
    <div class="base-card">
      <div class="flex justify-between items-center mb-6">
        <div class="page-title">Xodimlar</div>
        <div>
          <button @click="addUserBtn" class="add-outline-btn">Qo'shish</button>
        </div>
      </div>

      <!-- <div class="mb-8">
        <q-tabs class="base-tab" @update:model-value="changeStatus" v-model="user_type" no-caps>
          <q-tab name="active" label="Aktiv" />
          <q-tab name="block" label="Bloklangan" />
        </q-tabs>
      </div> -->
      <AddEditUser
        :key="addEditRoleDialog"
        :data="editItem"
        v-model="addEditRoleDialog"
        @change="roleAddedOrChanged"
      />

      <TheTable
        ref="tableRef"
        :loading="loading"
        :settings="tableSettings"
        :tableBodyCells="tableBodyCells"
        :data="data"
        :delete-fn="userStore?.deleteById"
        @fetch="request"
        @edit="editData"
        @reset-filter="resetFilter"
        action_width="60"
      />
    </div>
  </div>
</template>

<style></style>
