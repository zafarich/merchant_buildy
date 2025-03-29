<script setup>
import { nextTick, onMounted, ref } from 'vue-demi'
import { useRouter, useRoute } from 'vue-router'

import { formatPhoneNumber, isPermission } from 'src/utils/helpers'

import TheTable from 'src/components/table/TheTable.vue'
import TableActions from './table-cells/TableActions.vue'
import AddEditCategory from './modules/AddEditCategory.vue'
import TypeChip from './table-cells/TypeChip.vue'

import { useCategoriesStore } from 'src/stores/categories'

const route = useRoute()
const router = useRouter()

const categoriesStore = useCategoriesStore()

const loading = ref(false)
const data = ref([])
const query_status = route.query?.status?.toString()
const category_type = ref(/\b(EXPENSE|INCOME)\b/i?.test(query_status) ? query_status : 'EXPENSE')
const tableBodyCells = [
  {
    component: TypeChip,
    name: 'type',
  },
  {
    component: TableActions,
    name: '',
  },
]

const tableRef = ref(null)
const addEditRoleDialog = ref(false)
const editItem = ref({})
const params = ref({
  status: category_type.value,
})

async function fetchData() {
  loading.value = true
  await nextTick()
  params.value = { ...params.value, ...tableRef.value.pagination }
  data.value = (await categoriesStore.fetch(params.value)) || []
  tableRef.value.rowsNumber = categoriesStore.all_count
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
  defaultColumnOrder: ['name', 'type', ''],
  formatColumns: {
    type: (v) => (v === 'EXPENSE' ? 'Xarajat' : 'Kirim'),
  },
}

function addUserBtn() {
  editItem.value = {}
  addEditRoleDialog.value = true
}
function resetFilterAndFetch() {
  resetFilter()
  fetchData()
}

function resetFilter() {
  tableRef.value.resetPagination()
  category_type.value = 'active'
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
        <div class="page-title">Kategoriyalar</div>
        <div>
          <button @click="addUserBtn" class="add-outline-btn">Qo'shish</button>
        </div>
      </div>

      <!-- <div class="mb-8">
        <q-tabs class="base-tab" @update:model-value="changeStatus" v-model="category_type" no-caps>
          <q-tab name="EXPENSE" label="Xarajat" />
          <q-tab name="INCOME" label="Kirim" />
        </q-tabs>
      </div> -->
      <AddEditCategory
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
        :delete-fn="categoriesStore?.deleteById"
        @fetch="request"
        @edit="editData"
        @reset-filter="resetFilter"
        action_width="60"
      />
    </div>
  </div>
</template>

<style></style>
