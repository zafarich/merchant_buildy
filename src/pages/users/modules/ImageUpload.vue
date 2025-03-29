<script setup>
import { ref } from 'vue-demi'

import { FILE_UPLOAD_SIZE, ACCEPT_IMAGE_TYPES } from 'src/utils/config'

import BaseImg from 'src/components/base/BaseImg.vue'

const props = defineProps({
  oldAvatar: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const imagePreview = ref(props.oldAvatar || null)
const image_size_error = ref(false)

function handleFileChange(event) {
  const file = event.target.files[0]
  console.log('file.type', ACCEPT_IMAGE_TYPES.includes(file.type))
  if (!ACCEPT_IMAGE_TYPES.includes(file.type)) {
    return
  }
  const size = file.size
  if (size > FILE_UPLOAD_SIZE) {
    image_size_error.value = true
    return resetValidation(3000)
  }

  emit('update:modelValue', file)
  if (file) {
    previewImage(file)
  }
}
function previewImage(file) {
  const reader = new FileReader()

  reader.onload = () => {
    console.log('reader.result', reader.result)
    imagePreview.value = reader.result
  }

  reader.readAsDataURL(file)
}

let resetTimeout = 0
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout)
  resetTimeout = setTimeout(() => {
    image_size_error.value = false
  }, timeout)
}
</script>

<template>
  <div class="flex flex-col items-center mb-7">
    <div class="mb-1 w-20 h-20 border border-cbd5e0 rounded-full overflow-hidden">
      <BaseImg
        default_img="user"
        width="80px"
        height="80px"
        :key="imagePreview"
        :src="imagePreview ? imagePreview : `/images/default/user.png`"
      />
    </div>
    <label
      class="px-4 py-1.5 bg-[#F1F2F4] flex items-center rounded-full font-semibold cursor-pointer"
    >
      <input
        @change="handleFileChange"
        type="file"
        accept=".jpeg, .jpg, .png, .svg, .webp"
        class="hidden w-0 h-0 relative z-[-1]"
      />
      <img src="/images/users/foto.svg" alt="" class="mr-2.5" />
      <span>Rasm qo'shish</span>
    </label>
    <div class="text-f91155 text-center mt-2" v-if="image_size_error">
      Размер изображения должен быть меньше 2 МБ.
    </div>
  </div>
</template>

<style></style>
