<script setup>
import { ref, watchEffect, computed, watch } from 'vue-demi'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { tableHeader } from 'src/utils/table-translate'

import { deepCopy } from 'src/utils/helpers'

import DeleteTableItem from 'src/components/table/DeleteTableItem.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const emit = defineEmits(['fetch', 'delete', 'edit', 'reset-filter'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  action_width: {
    default: null,
  },
  deleteFn: {
    type: Function,
    default: () => ({}),
  },
  data: {
    type: Array,
    default: () => [],
  },
  settings: {
    type: Object,
    default: null,
  },
  tableBodyCells: {
    type: Array,
    default: () => [],
  },
})

const bodyCells = computed(() => props?.tableBodyCells)

const defaultPagination = {
  page: 1,
  per_page: 10,
}

const rowsNumber = ref(0)
const pagination = ref({
  page: +route?.query?.page || defaultPagination.page,
  per_page: +route?.query?.per_page || defaultPagination.per_page,
})
const deleteConfirmModel = ref(false)
const columns = ref([])
const tableCols = ref({})
const currentTableCols = ref([])
const temp_active_item_id = ref(null)

const max_page_count = computed(() => {
  return Math.ceil(rowsNumber.value / pagination.value.per_page)
})
watchEffect(() => {
  currentTableCols.value = tableCols.value[route.name]
})
function prepareHeaders() {
  const cols = props.settings?.defaultColumnOrder

  const tableColumns = []

  for (let i = 0; i < cols?.length; i++) {
    const colName = cols[i]

    tableColumns.push({
      label: tableHeader?.[colName] === '""' ? '' : tableHeader?.[colName],
      name: colName,
      field: props.settings?.fieldFormatColumns?.[colName] || colName,
      sortable: false,
      align: 'left',
      format: props.settings?.formatColumns?.[colName],
    })
  }
  columns.value = tableColumns
}
function deleteData(id) {
  deleteConfirmModel.value = true
  temp_active_item_id.value = id
}
async function deleteConfirmAction() {
  $q.loading.show()
  try {
    await props.deleteFn(temp_active_item_id.value)
    resetFilter()
    updateData()
    deleteConfirmModel.value = false
  } catch {
  } finally {
    $q.loading.hide()
  }
}
function changePagination() {
  router.replace({
    query: {
      ...route.query,
      ...pagination.value,
    },
  })
  updateData()
}
function updateData() {
  emit('fetch', {
    ...pagination.value,
  })
}
function editData(data) {
  emit('edit', data)
}
function changePerPage() {
  pagination.value.page = 1
  changePagination()
}
function resetFilter() {
  router.replace({ query: {} })
  emit('reset-filter')
}
defineExpose({
  prepareHeaders,
  pagination,
  rowsNumber,
  resetPagination() {
    pagination.value = deepCopy(defaultPagination)
  },
})
</script>
<template>
  <q-table
    v-bind="$attrs"
    class="table no-shadow my-6"
    separator="horizontal"
    loading-label="Yuklanmoqda..."
    :columns="columns"
    :rows="data"
    :rows-per-page-options="[50]"
    :loading="loading"
    virtual-scroll
    color="primary"
  >
    <template v-for="(cell, idx) in bodyCells" :key="idx" #[`body-cell-${cell.name}`]="props">
      <q-td
        :style="{
          width: action_width && cell.name === '' ? `${action_width}px` : 'unset',
        }"
      >
        <component
          :is="cell.component"
          :resource="resource"
          @delete="deleteData"
          @edit="editData"
          @fetch="updateData"
          :props-data="{
            ...props,
            ...cell.props,
            columnName: cell.name,
          }"
        />
      </q-td>
    </template>
  </q-table>
  <div class="flex items-center justify-between" v-if="max_page_count > 0">
    <q-pagination
      v-model="pagination.page"
      @update:model-value="changePagination"
      :max="max_page_count"
      :max-pages="6"
      boundary-numbers
      color=""
      direction-links
      class="table-pagination"
      icon-prev="img:/images/icons/chevron_left_16.svg"
      icon-next="img:/images/icons/chevron_right_16.svg"
    />
    <div class="flex items-center">
      <div class="text-xs text-687588 mr-4">Jami</div>

      <q-select
        v-model="pagination.per_page"
        @update:model-value="changePerPage"
        dropdown-icon="img:/images/icons/chevron_down_16.svg"
        class="table-view-select"
        outlined
        :options="[10, 25, 50]"
        popup-content-class="table-view-select-content"
      ></q-select>
    </div>
  </div>

  <DeleteTableItem @confirm="deleteConfirmAction" v-model="deleteConfirmModel" />
</template>

<style lang="scss">
.table-view-select {
  .q-field__marginal {
    height: 32px;
  }
  .q-field__inner {
    flex: unset;
  }

  .q-select__dropdown-icon {
    width: 16px;
    img {
      width: 16px;
    }
  }
  .q-field__control:before {
    border: 1px solid $gray-1;
  }
  .q-field__native {
    font-weight: 500;
    font-size: 12px;
  }
  .q-field__control,
  .q-field__native {
    min-height: 32px !important;
  }
  .q-field__control {
    border-radius: 8px;
    padding: 0px 10px !important;
  }
  .q-field__append {
    padding-left: 10px !important;
  }
  .q-field__control:after {
    border-width: 1px !important;
  }
}
.table-view-select-content {
  border-radius: 8px;
  box-shadow: 0px 5px 40px 0px rgba(0, 0, 0, 0.1);
  .q-virtual-scroll__content {
    .q-item {
      padding: 6px 10px;
      min-height: 32px;
      font-size: 12px;
      font-weight: 500;
      .q-item__label {
        color: #000000;
      }
    }
  }

  .q-position-engine {
    transform: translateY(2px);
  }
}
.table-pagination {
  button.q-btn {
    height: 32px;
    font-weight: 600;
    min-width: 32px !important;
    margin: 0;
    border-radius: 10px;
    padding: 0px 6px !important;
    &::before {
      display: none;
    }
    &[aria-current='true'] {
      background-color: $gray-8;
      color: $dark-1 !important;
    }
  }
  .q-pagination__middle {
    // margin: 0px 24px;
  }

  .q-pagination__content {
    & > button {
      border-radius: 8px;

      .q-icon {
        width: 16px;
      }

      &:disabled {
        opacity: 0.5 !important;
      }
    }

    & > button:first-child,
    & > button:last-child {
      border: 1px solid $gray-7;
    }
    & > button:first-child {
      margin-right: 24px;
    }
    & > button:last-child {
      margin-left: 24px;
    }
  }
}
.table {
  width: 100%;
  .q-table__bottom {
    display: none;
  }
  .q-table {
    border-collapse: collapse !important;
    thead {
      background-color: $gray-10;
      border-radius: 10px;
      th {
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 0.2px;
        border-bottom: none !important;
        color: $gray-2;
        &:first-child {
          border-radius: 10px 0px 0px 10px;
        }
        &:last-child {
          border-radius: 0px 10px 10px 0px;
        }
      }
    }
    tbody {
      td {
        padding: 12px;
        border-bottom-color: $gray-6 !important;
        &::before {
          // background-color: $gray-4 !important;
          display: none;
        }
      }
    }
    tbody:not(.q-virtual-scroll__padding) {
      tr:last-child {
        border-bottom: 1px solid $gray-6;
      }
    }
  }

  &.not-pointer {
    &:deep(tr) {
      cursor: default !important;
    }
  }
}
</style>
