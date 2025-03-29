<script setup>
import { isPermission } from 'src/utils/helpers'
import { ref } from 'vue-demi'
import { useQuasar } from 'quasar'

import { useUserStore } from 'src/stores/user'

const $q = useQuasar()

const userStore = useUserStore()

const props = defineProps({
  propsData: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['delete', 'edit', 'fetch'])

const action_menu = ref(false)

async function changeBlockStatus() {
  const res = await userStore.changeBlockStatus(props.propsData.row.id, {
    is_do_block: !props.propsData.row?.is_blocked,
  })
  console.log('res', res)
  if (res.success) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      position: 'top',
      message: props.propsData.row?.is_blocked
        ? 'Пользователь разблокирован'
        : 'Пользователь заблокирован',
      timeout: 4000,
    })

    emit('fetch')
  }
}
</script>
<template>
  <div class="flex gap-2">
    <q-btn @click="emit('edit', propsData.row)" size="sm" flat dense color="primary">
      <q-icon name="edit"></q-icon>
    </q-btn>

    <q-btn @click="emit('delete', propsData.row.id)" size="sm" flat dense color="negative">
      <q-icon name="delete"></q-icon>
    </q-btn>
  </div>
</template>

<style></style>
