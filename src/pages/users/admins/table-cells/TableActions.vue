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
  <div>
    <button class="p-1 w-8 h-8 rounded-lg" :class="{ 'bg-f8f8f8': action_menu }">
      <img src="/images/icons/dots_vertical.svg" alt="" />

      <q-menu v-model="action_menu" class="not-shadow" anchor="bottom right" self="top end">
        <div class="mt-1 shadow-actions-card py-1.5 rounded-xl bg-white">
          <div v-if="isPermission('users.update')">
            <button
              @click="emit('edit', propsData.row)"
              v-close-popup
              class="text-left w-full py-2.5 px-4 hover:bg-f8f8f8"
            >
              O'zgartirish
            </button>
          </div>
          <div>
            <button
              @click="changeBlockStatus"
              v-close-popup
              class="text-left w-full py-2.5 px-4 hover:bg-f8f8f8"
            >
              {{ propsData.row?.is_blocked ? 'Blokdan ochish' : 'Blok qilish' }}
            </button>
          </div>
          <div v-if="isPermission('users.delete')">
            <button
              v-close-popup
              @click="emit('delete', propsData.row.id)"
              class="text-left w-full text-e03137 py-2.5 px-4 hover:bg-f8f8f8"
            >
              O'chirish
            </button>
          </div>
        </div>
      </q-menu>
    </button>
  </div>
</template>

<style></style>
