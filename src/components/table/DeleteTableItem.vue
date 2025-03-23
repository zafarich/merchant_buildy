<script setup>
import BaseModal from 'src/components/base/BaseModal.vue'

const emit = defineEmits(['update:modelValue', 'confirm'])

function open() {
  emit('update:modelValue', true)
}
function close() {
  emit('update:modelValue', false)
}
</script>
<template>
  <BaseModal :model-value="modelValue" @close="close" class="delete-item-dialog">
    <div class="row items-center q-pb-none">
      <div class="text-bold text-2xl mb-4">O'chirish?</div>
      <button class="close-modal_btn" v-close-popup>
        <img src="/images/icons/close-modal.png" alt="" />
      </button>
    </div>
    <div>
      <div class="text-base mb-7">Вся информация о профиле будет потеряна</div>

      <div class="flex items-center">
        <button @click="close" class="px-6 h-10 font-bold rounded-xl bg-ffd023">
          Bekor qilish
        </button>
        <button @click="emit('confirm')" class="px-6 h-10 font-bold rounded-xl bg-f1f2f4 ml-3">
          O'chirish
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style lang="scss">
.delete-item-dialog {
  .q-card {
    padding: 32px;
    width: 440px;
  }
}
</style>
