<template>
  <q-select
    class="base-select"
    popup-content-class="base-select-content"
    hide-bottom-space
    dropdown-icon="keyboard_arrow_down"
    transition-show="jump-up"
    transition-hide="jump-down"
    :transition-duration="50"
    lazy-rules="ondemand"
    v-bind="attrs"
    options-dense
    @update:model-value="change"
    :model-value="modelValue"
  >
    <template v-if="selected && modelValue" #selected>
      {{ modelValue?.label || '' }}
    </template>
    <template v-else-if="placeholder && !modelValue" #selected>
      <div class="placeholder">
        <span>{{ placeholder }}</span>
        <span v-if="required" class="text-red">*</span>
      </div>
    </template>
    <!-- <template v-if="!placeholder" #label>
        <span>{{ label }}</span>
      </template> -->
    <template v-if="append" #append>
      <slot name="append" />
    </template>
    <template v-if="prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="option" #option="item">
      <slot name="option" v-bind="item" />
    </template>
  </q-select>
</template>

<script setup>
import { useAttrs } from 'vue-demi'

const attrs = useAttrs()

defineProps({
  modelValue: [Number, String, Object],
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  append: {
    type: Boolean,
    default: false,
  },
  prepend: {
    type: Boolean,
    default: false,
  },
  option: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

function change(v) {
  emit('update:modelValue', v)
}
</script>

<style lang="scss"></style>
