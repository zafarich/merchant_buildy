<script setup>
import { computed } from 'vue'

import BaseImg from 'src/components/base/BaseImg.vue'

const props = defineProps({
  propsData: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['delete', 'edit'])

const fio = computed(() => {
  const user = props?.propsData?.row
  return `${user?.last_name} ${user?.first_name} ${user?.surname}`
})
</script>
<template>
  <div class="flex items-center">
    <BaseImg default_img="user" :src="propsData?.row?.avatar" />
    <div class="text-xs ml-3">{{ fio }}</div>
  </div>
</template>

<style></style>
