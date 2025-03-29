<script setup>
import { CARD_COLOR_OBJ, STATUS_TEXT_OBJ_SINGULAR } from 'src/types/expenseTypes'

const props = defineProps({
  propsData: {
    type: Object,
    default: null,
  },
})
</script>
<template>
  <div
    class="py-0.5 px-2 rounded-[50px] font-bold text-xs inline-block h-5.5"
    :style="{
      backgroundColor: CARD_COLOR_OBJ?.[propsData.row?.type]?.background,
      color: CARD_COLOR_OBJ?.[propsData.row?.type]?.text,
    }"
  >
    {{ STATUS_TEXT_OBJ_SINGULAR[propsData.row?.type] }}
  </div>
</template>

<style></style>
