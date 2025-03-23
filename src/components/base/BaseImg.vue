<script setup>
import { computed, useAttrs } from 'vue-demi'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  default_img: {
    type: String,
    default: '',
  },
})

const attrs = useAttrs()

const baseUrlFile = process.env.BASE_URL_FILE

const imgUrl = computed(() => {
  if (
    props?.src?.startsWith('http://') ||
    props?.src?.startsWith('https://') ||
    props?.src?.startsWith('data:image/')
  ) {
    return props.src
  } else {
  }
  return props.src ? baseUrlFile + props.src : `/images/default/${props?.default_img}.png`
})
</script>
<template>
  <q-img
    :src="imgUrl"
    class="base-img"
    v-bind="attrs"
    :width="attrs.width || '32px'"
    :height="attrs.height || '32px'"
    :draggable="false"
    fit="contain"
    spinner-size="18px"
  >
    <template v-slot:error>
      <q-img
        :src="`/images/default/${default_img}.png`"
        alt="error-placeholder"
        :width="attrs.width || '32px'"
        :height="attrs.height || '32px'"
        spinner-size="18px"
        :draggable="false"
        fit="contain"
      />
    </template>
  </q-img>
</template>

<style lang="scss">
.base-img {
  .q-img__content {
    > div {
      background: unset;
      border-radius: 0px;
    }
  }
}
</style>
