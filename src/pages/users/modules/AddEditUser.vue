<script setup>
import { computed, onMounted, ref } from 'vue-demi'
import { useQuasar, Platform } from 'quasar'

import validate from 'src/utils/validate'
import { formatOnlyNumber, getServerError, removePhonePrefix, sleep } from 'src/utils/helpers'
import { PHONE_PREFIX } from 'src/utils/config'

import BaseInput from 'src/components/base/BaseInput.vue'
import BaseModal from 'src/components/base/BaseModal.vue'
import BaseSelect from 'src/components/base/BaseSelect.vue'
import ImageUpload from './ImageUpload.vue'

import { useUserStore } from 'src/stores/user'
import { TEXT_OBJ } from 'src/types/positionTypes'

const $q = useQuasar()

const userStore = useUserStore()

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  data: {
    default: null,
  },
})
// Modal pozitsiyasini aniqlash uchun computed property
const modalPosition = computed(() => (Platform.is.mobile ? 'bottom' : 'standard'))
const errors = ref([])
const isPwd = ref(true)
const is_edit = computed(() => !!props.data?.id)
const user_positions = Object.keys(TEXT_OBJ).map((item) => {
  return {
    value: item,
    label: TEXT_OBJ[item],
  }
})
const emptyData = {
  image: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  gender: 'male',
  position: '',
  salary: {
    type: '',
    amount: '',
  },
  phone: '',
  password: '',
  password_confirmation: '',
  status: 'active',
}
const user = ref({
  ...emptyData,
})

const workTypes = ref([
  {
    value: 'hourly',
    label: 'Soatli',
  },
  {
    value: 'fixed',
    label: "O'zgarmas oylik",
  },
])
const formRef = ref(null)

onMounted(() => {
  insteadEditData()
})
// Summani formatlash uchun funksiya
function formatNumber(num) {
  if (!num) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Summani tozalash (faqat raqamlarni qoldirish)
function cleanNumber(str) {
  return str.toString().replace(/[^\d]/g, '')
}
// Formatlangan summa
const formattedAmount = computed({
  get: () => formatNumber(user.value.salary.amount),
  set: (val) => {
    user.value.salary.amount = cleanNumber(val)
  },
})

function insteadEditData() {
  const data = props?.data
  console.log('data', data)

  if (data === null) return

  let amount = data?.work_type === 'fixed' ? data?.monthly_salary : data?.hourly_rate
  console.log('amount', data?.work_type)

  if (amount?.toString()?.endsWith('.00')) {
    amount = parseInt(amount, 10)
  }

  user.value.image = data.image
  user.value.first_name = data.first_name
  user.value.last_name = data.last_name
  user.value.middle_name = data.middle_name
  user.value.gender = data.gender
  user.value.position = user_positions.find((i) => i.value === data?.position)
  user.value.salary.type = workTypes.value.find((i) => i.value === data?.work_type)
  user.value.salary.amount = amount
  user.value.phone = removePhonePrefix(data.user?.phone)
  user.value.status = data?.status
  if (is_edit.value) {
    delete user.value.password
  }
}
async function addEditMethod() {
  resetValidation()
  sleep(10)
  errors.value = []
  const hasError = !(await formRef.value.validate())
  if (hasError) return resetValidation(3000)

  const payload = {
    ...user.value,
    role_id: user.value.role?.id,
    phone: formatOnlyNumber(user.value?.phone),
  }
  const fd = new FormData()
  if (typeof payload.image === 'object' && payload.image) {
    fd.append('image', payload.image)
  }
  fd.append('first_name', payload.first_name)
  fd.append('last_name', payload.last_name)
  fd.append('last_name', payload.last_name)
  fd.append('middle_name', payload.middle_name)
  fd.append('gender', payload.gender)
  fd.append('position', payload.position?.value)
  fd.append('work_type', payload.salary?.type?.value)
  fd.append('status', payload?.status)

  const salary_amount_key =
    payload.salary?.type?.value === 'fixed' ? 'monthly_salary' : 'hourly_rate'

  fd.append(salary_amount_key, payload.salary?.amount)
  if (!is_edit.value) {
    fd.append('password', payload.password)
  }

  fd.append('phone', PHONE_PREFIX + payload.phone)
  delete payload.role

  $q.loading.show()
  try {
    const res = is_edit.value
      ? await userStore.update(props.data?.id, fd)
      : await userStore.create(fd)

    if (res.success) {
      emit('change')
      user.value = { ...emptyData }
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

// Faqat raqamlarni qabul qilish uchun funksiya
function onlyNumbers(evt) {
  const keyCodes = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
  ]
  if (!keyCodes.includes(evt.key)) {
    evt.preventDefault()
  }
}
</script>
<template>
  <BaseModal
    :model-value="modelValue"
    @close="close"
    class="user-add-dialog"
    :position="modalPosition"
  >
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
            <ImageUpload :oldAvatar="user.image" v-model="user.image" />
            <div class="mb-4">
              <BaseInput
                v-model="user.first_name"
                :rules="[validate?.required, () => errors?.first_name?.[0] || true]"
                outlined
                label="Ism"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>
            <div class="mb-4">
              <BaseInput
                v-model="user.last_name"
                :rules="[validate?.required, () => errors?.last_name?.[0] || true]"
                outlined
                label="Familiya"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>
            <div class="mb-4">
              <BaseInput
                v-model="user.middle_name"
                :rules="[validate?.required, () => errors?.middle_name?.[0] || true]"
                outlined
                label="Otasining ismi"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>
            <div class="mb-4">
              <div class="flex items-center gap-4">
                <q-radio v-model="user.gender" val="male" label="Erkak" class="base-radio" />
                <q-radio v-model="user.gender" val="female" label="Ayol" class="base-radio" />
              </div>
            </div>

            <div class="mb-4">
              <BaseSelect
                v-model="user.position"
                :options="user_positions"
                :rules="[validate?.required]"
                outlined
                label="Lavozimi"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>

            <div class="grid grid-cols-2 gap-2 mb-4">
              <div>
                <BaseSelect
                  v-model="user.salary.type"
                  :options="workTypes"
                  :rules="[validate?.required]"
                  outlined
                  label="Oylik turi"
                  @update:model-value="resetValidation"
                  @keyup.enter="addEditMethod"
                />
              </div>
              <div>
                <BaseInput
                  v-model="formattedAmount"
                  :rules="[validate?.required]"
                  outlined
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  @keypress="onlyNumbers"
                  :label="
                    user.salary.type?.value === 'hourly' ? 'Soatiga qancha(so\'m)' : 'Oylik summa'
                  "
                  @update:model-value="resetValidation"
                  @keyup.enter="addEditMethod"
                />
              </div>
            </div>

            <div class="mb-4">
              <BaseInput
                v-model="user.phone"
                type="tel"
                :rules="[
                  validate?.required,
                  validate?.phone_number,
                  () => errors?.phone_number?.[0] || true,
                ]"
                mask="## ### ## ##"
                class="input-with-prepend"
                outlined
                label="Telefon nomer"
                prepend
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              >
                <template v-slot:prepend> +998 </template>
              </BaseInput>
            </div>

            <div class="mb-4" v-if="!is_edit">
              <BaseInput
                v-model="user.password"
                :rules="[validate?.required, () => errors?.password?.[0] || true]"
                label="Parol"
                name="current-pasword"
                append
                outlined
                :type="isPwd && user.password?.length ? 'password' : 'text'"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              >
                <template v-slot:append v-if="user.password?.length">
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click.passive="isPwd = !isPwd"
                  />
                </template>
              </BaseInput>
            </div>

            <div class="mb-4" v-if="!is_edit">
              <BaseInput
                v-model="user.password_confirmation"
                :rules="[
                  validate?.required,
                  () => errors?.password_confirmation?.[0] || true,
                  () => user.password === user.password_confirmation || 'Parollar mos kelmadi',
                ]"
                label="Parolni tasdiqlash"
                name="password-confirmation"
                append
                outlined
                :type="isPwd && user.password_confirmation?.length ? 'password' : 'text'"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              >
                <template v-slot:append v-if="user.password_confirmation?.length">
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click.passive="isPwd = !isPwd"
                  />
                </template>
              </BaseInput>
            </div>

            <div class="mb-7">
              <q-toggle
                class="switch-btn"
                v-model="user.status"
                checked-icon="img:/images/icons/checked.svg"
                color="green"
                unchecked-icon="img:/images/icons/unchecked.svg"
                :label="`Status - ${user.status === 'active' ? 'aktiv' : 'aktiv emas'}`"
                true-value="active"
                false-value="inactive"
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
.user-add-dialog .q-card {
  padding: 32px;
  width: 500px;
}
</style>
