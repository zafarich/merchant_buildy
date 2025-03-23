<script setup>
import { ref } from 'vue-demi'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import validate from 'src/utils/validate'
import { formatPhone } from 'src/utils/helpers'

import BaseInput from 'src/components/base/BaseInput.vue'

import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()

const authStore = useAuthStore()

const isPwd = ref(true)
const formRef = ref(null)
const user = ref({
  phone: '900000002',
  password: 'password123',
})

const onLoginFormSubmit = async () => {
  resetValidation()
  const hasError = !(await formRef.value.validate())
  if (hasError) return resetValidation(5000)

  const payload = {
    phone: formatPhone(user.value.phone),
    password: user.value.password,
  }

  try {
    // Call the login method from the auth store
    $q.loading.show()
    const loginResult = await authStore.login(payload)

    if (loginResult?.success) {
      router.push({ name: 'dashboard' })
    }
  } catch (error) {
    $q.notify({
      progress: true,
      position: 'top',
      message: error?.response?.data?.message,
      type: 'info',
      color: 'negative',
      timeout: 3000,
    })
    console.error('Login failed:', error)
  } finally {
    $q.loading.hide()
  }
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
  <div class="w-full h-screen flex items-center justify-center">
    <div class="rounded-20 bg-white pt-10 pb-8 px-8 w-[420px]">
      <div class="font-bold text-xl text-center mb-9">Data Group - Buildy</div>

      <q-form ref="formRef" autofocus>
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
            label="Telefon raqam"
            prepend
            @update:model-value="resetValidation"
            @keyup.enter="onLoginFormSubmit"
          >
            <template v-slot:prepend> +998 </template>
          </BaseInput>
        </div>
        <div class="mb-7">
          <BaseInput
            v-model="user.password"
            :rules="[validate?.required]"
            label="Parol"
            name="current-pasword"
            append
            outlined
            :type="isPwd && user.password?.length ? 'password' : 'text'"
            @update:model-value="resetValidation"
            @keyup.enter="onLoginFormSubmit"
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

        <div>
          <button @click="onLoginFormSubmit" type="button" class="login-btn">Kirish</button>
        </div>
      </q-form>
    </div>
  </div>
</template>

<style></style>
