<script setup>
import { computed, onMounted, ref } from 'vue-demi'
import { useQuasar } from 'quasar'

import validate from 'src/utils/validate'
import { getServerError, sleep } from 'src/utils/helpers'

import BaseInput from 'src/components/base/BaseInput.vue'
import BaseModal from 'src/components/base/BaseModal.vue'
import BaseSelect from 'src/components/base/BaseSelect.vue'

import { useUserStore } from 'src/stores/user'

const $q = useQuasar()

const userStore = useUserStore()

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const errors = ref([])
const is_edit = computed(() => !!props.data?.id)
const emptyData = {
  name: '',
  type: '',
}
const category = ref({
  ...emptyData,
})
const typesList = ref([
  {
    value: 'EXPENSE',
    label: 'Xarajat',
  },
  {
    value: 'INCOME',
    label: 'Kirim',
  },
])
const formRef = ref(null)

onMounted(() => {
  insteadEditData()
})

function insteadEditData() {
  const data = props.data
  if (typeof data !== 'object') return

  category.value.name = data.name
  category.value.type = data.type
}
async function addEditMethod() {
  resetValidation()
  sleep(10)
  errors.value = []
  const hasError = !(await formRef.value.validate())
  if (hasError) return resetValidation(3000)

  const payload = {
    ...category.value,
  }

  $q.loading.show()
  try {
    const res = is_edit.value
      ? await userStore.update(props.data?.id, payload)
      : await userStore.create(payload)

    if (res.success) {
      emit('change')
      category.value = { ...emptyData }
    }
  } catch (error) {
    errors.value = getServerError(error)
    await formRef.value.validate()
    resetValidation(5000)
  } finally {
    $q.loading.hide()
  }
}
function close() {
  emit('update:model-value', false)
}
let resetTimeout = 0
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout)
  resetTimeout = setTimeout(() => {
    formRef.value.resetValidation()
  }, timeout)
}
</script>
<template>
  <BaseModal :model-value="modelValue" @close="close" class="category-add-dialog">
    <div>
      <div class="row items-center q-pb-none">
        <div class="title-modal">
          {{ is_edit ? "O'zgartirish" : "Qo'shish" }}
        </div>
        <q-space />
        <button class="close-modal_btn" v-close-popup>
          <img src="/images/icons/close-modal.png" alt="" />
        </button>
      </div>
      <div>
        <div>
          <q-form ref="formRef" autofocus>
            <div class="mb-4">
              <BaseInput
                v-model="category.name"
                :rules="[validate?.required]"
                outlined
                label="Kategoriya nomi"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>

            <div class="mb-7">
              <BaseSelect
                v-model="category.type"
                :options="typesList"
                :rules="[validate?.required]"
                outlined
                label="Kategoriya turi"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>
          </q-form>
        </div>

        <div>
          <button
            @click="addEditMethod"
            class="px-6 w-full h-14 text-base text-white font-bold rounded-xl bg-primary"
          >
            {{ is_edit ? "O'zgartirish" : "Qo'shish" }}
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style lang="scss">
.category-add-dialog .q-card {
  padding: 32px;
  width: 500px;
}
</style>
