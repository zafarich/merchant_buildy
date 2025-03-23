<script setup>
import { computed, onMounted, ref, nextTick } from 'vue-demi'
import { useQuasar, Platform } from 'quasar'

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
    default: () => null,
  },
})
const errors = ref([])
const is_edit = computed(() => !!props.data?.id)
const emptyData = {
  transaction_type: 'EXPENSE',
  amount: '',
  category_id: '',
  comment: '',
  receipt_image: '',
}
const category = ref({
  ...emptyData,
})
const typesList = ref([
  {
    value: 1,
    label: 'Abed',
  },
  {
    value: 2,
    label: 'Zapchast',
  },
])
const formRef = ref(null)

// Kamera uchun o'zgaruvchilar
const showCamera = ref(false)
const videoStream = ref(null)
const videoRef = ref(null)
const capturedImage = ref(null)

// Rasmlar soni chegarasi
const MAX_IMAGES = 5

// Yangi ref qo'shamiz
const fileInput = ref(null)

// Modal pozitsiyasini aniqlash uchun computed property
const modalPosition = computed(() => (Platform.is.mobile ? 'bottom' : 'standard'))

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

// Kamera ruxsatini tekshirish
const checkCameraPermissions = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' })
    if (result.state === 'denied') {
      throw new Error('Kameraga ruxsat berilmagan')
    }
  } catch (error) {
    console.error('Permission check error:', error)
  }
}

// Kamerani ochish
const openCamera = async () => {
  try {
    await checkCameraPermissions()

    // Avvalgi stream'ni to'xtatish
    if (videoStream.value) {
      videoStream.value.getTracks().forEach((track) => track.stop())
      videoStream.value = null
    }

    // Kamerani ochish
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
      },
    })

    videoStream.value = stream
    showCamera.value = true

    // Video elementini ulash
    await nextTick()
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (error) {
    console.error('Camera error:', error)
    $q.notify({
      message: 'Kamerani ochishda xatolik yuz berdi. Kameraga ruxsat berganingizni tekshiring.',
      color: 'negative',
      timeout: 3000,
    })
  }
}

// Kamerani yopish
const closeCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach((track) => track.stop())
  }
  showCamera.value = false
}

// Rasmga olish
const capturePhoto = () => {
  console.log('Capturing photo...')
  const video = videoRef.value
  if (!video) {
    console.log('No video element found')
    return
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    // Rasmni chizish
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Rasmni base64 formatda olish
    capturedImage.value = canvas.toDataURL('image/jpeg', 0.7)
    category.value.receipt_image = capturedImage.value
    console.log('Image captured and saved')

    // Kamerani yopish
    closeCamera()
  } catch (error) {
    console.error('Error capturing photo:', error)
    $q.notify({
      type: 'negative',
      message: 'Rasmga olishda xatolik yuz berdi',
    })
  }
}

// Rasmni yuklash
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Faylni tekshirish
  if (!file.type.includes('image/')) {
    $q.notify({
      type: 'negative',
      message: 'Faqat rasm fayllarini yuklash mumkin',
    })
    return
  }

  // Rasmni base64 formatiga o'tkazish
  const reader = new FileReader()
  reader.onloadend = () => {
    capturedImage.value = reader.result
    category.value.receipt_image = reader.result
  }
  reader.readAsDataURL(file)
}

// Rasmni o'chirish
function removeImage(index) {
  const images = category.value.receipt_image.split(',')
  images.splice(index, 1)
  category.value.receipt_image = images.join(',')
}
</script>
<template>
  <BaseModal
    :model-value="modelValue"
    @close="close"
    class="category-add-dialog"
    persistent
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
          <div class="flex gap-4 mb-4">
            <button
              type="button"
              @click="category.transaction_type = 'EXPENSE'"
              class="flex-1 h-12 rounded-xl border-2 font-medium"
              :class="[
                category.transaction_type === 'EXPENSE'
                  ? 'border-primary text-primary'
                  : 'border-[#E2E8F0] bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Xarajat
            </button>
            <button
              type="button"
              @click="category.transaction_type = 'INCOME'"
              class="flex-1 h-12 rounded-xl border-2 font-medium"
              :class="[
                category.transaction_type === 'INCOME'
                  ? 'border-primary text-primary'
                  : 'border-[#E2E8F0] bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Kirim
            </button>
          </div>

          <q-form ref="formRef" autofocus>
            <div class="mb-4">
              <BaseInput
                v-model="category.amount"
                :rules="[validate?.required]"
                outlined
                :label="
                  category.transaction_type === 'EXPENSE'
                    ? 'Xarajat summasi (so\'mda)'
                    : 'Kirim summasi (so\'mda)'
                "
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>

            <div class="mb-4">
              <BaseSelect
                v-model="category.category_id"
                :options="typesList"
                :rules="[validate?.required]"
                outlined
                label="Kategoriya"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>

            <div class="mb-4">
              <BaseInput
                v-model="category.comment"
                :rules="[validate?.required]"
                outlined
                label="Izoh"
                @update:model-value="resetValidation"
                @keyup.enter="addEditMethod"
              />
            </div>

            <div class="mb-4">
              <input
                type="file"
                hidden
                ref="fileInput"
                accept="image/*"
                @change="handleFileUpload"
              />
              <div class="border border-[#E2E8F0] rounded-xl p-3">
                <div class="font-semibold mb-2">Chekni yuklash</div>
                <button
                  type="button"
                  @click="openCamera"
                  class="w-full flex h-12 justify-center mb-2 rounded-xl border-2 border-[#E2E8F0] bg-white text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center justify-center gap-2">
                    <q-icon name="o_photo_camera" size="20px" />
                    <span>Rasmga olish</span>
                  </div>
                </button>
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="w-full flex h-12 justify-center rounded-xl border-2 border-[#E2E8F0] bg-white text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center justify-center gap-2">
                    <q-icon name="o_upload_file" size="20px" />
                    <span>Mavjud chekni yuklash</span>
                  </div>
                </button>

                <!-- Yuklangan rasm -->
                <div v-if="capturedImage" class="mt-4">
                  <div class="w-[100px] aspect-square relative">
                    <div class="w-full h-full rounded-lg overflow-hidden">
                      <img :src="capturedImage" class="w-full h-full object-cover" />
                    </div>
                    <button
                      class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                      @click="
                        () => {
                          capturedImage = null
                          category.value.receipt_image = ''
                        }
                      "
                    >
                      <q-icon name="close" size="16px" />
                    </button>
                  </div>
                </div>
              </div>
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

    <!-- Kamera modali -->
    <q-dialog v-model="showCamera" persistent maximized>
      <div class="bg-black h-full w-full">
        <!-- Header -->
        <div class="fixed top-0 left-0 right-0 bg-black q-py-sm z-20">
          <div class="flex items-center px-4">
            <q-btn flat round icon="close" color="white" @click="closeCamera" />
            <div class="flex-1 text-center text-white font-medium">Chekni rasmga olish</div>
            <div class="w-10"></div>
          </div>
        </div>

        <!-- Camera View -->
        <div class="h-full w-full flex flex-col">
          <div class="flex-1 flex items-center justify-center bg-black">
            <div class="w-full aspect-square relative">
              <video ref="videoRef" autoplay playsinline muted class="w-full h-full"></video>
              <div class="absolute inset-0 border-2 border-white/30 pointer-events-none z-10"></div>
            </div>
          </div>

          <!-- Capture Button -->
          <div class="p-4 bg-black flex items-center justify-center z-20">
            <button
              class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
              @click="capturePhoto"
            >
              <div class="w-12 h-12 rounded-full bg-white"></div>
            </button>
          </div>
        </div>
      </div>
    </q-dialog>
  </BaseModal>
</template>

<style lang="scss">
.category-add-dialog .q-card {
  padding: 18px;
  width: 500px;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview {
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
}
</style>
