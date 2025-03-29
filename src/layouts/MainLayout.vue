<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title></q-toolbar-title>

        <q-btn-dropdown flat no-caps class="profile-dropdown" color="primary">
          <template v-slot:label>
            <div class="flex items-center">
              <q-avatar size="32px" color="primary" text-color="white">
                {{ userInitials }}
              </q-avatar>
              <span class="q-ml-sm text-weight-medium">{{ authStore?.user?.name }}</span>
            </div>
          </template>

          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Chiqish</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="flex flex-col justify-between pb-10"
      show-if-above
      bordered
    >
      <div>
        <q-toolbar-title class="text-center py-5 font-bold text-primary">Buildy</q-toolbar-title>

        <q-list padding class="menu-list px-4">
          <q-item class="flex items-center" clickable v-ripple :to="{ name: 'dashboard' }" exact>
            <q-icon class="mr-3" size="22px" name="o_home" />
            <q-item-section>Bosh sahifa</q-item-section>
          </q-item>

          <q-item class="flex items-center" clickable v-ripple :to="{ name: 'finance' }" exact>
            <q-icon class="mr-3" size="22px" name="o_payments" />
            <q-item-section>Xarajat va kirim</q-item-section>
          </q-item>

          <q-item class="flex items-center" clickable v-ripple :to="{ name: 'categories' }" exact>
            <q-icon class="mr-3" size="22px" name="o_category" />
            <q-item-section>Kategoriyalar</q-item-section>
          </q-item>
          <q-item class="flex items-center" clickable v-ripple :to="{ name: 'employees' }" exact>
            <q-icon class="mr-3" size="22px" name="o_people" />
            <q-item-section>Xodimlar</q-item-section>
          </q-item>

          <q-item class="flex items-center" clickable v-ripple :to="{ name: 'contracts' }" exact>
            <q-icon class="mr-3" size="22px" name="o_description" />
            <q-item-section>Shartnomalar</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- <q-list padding class="menu-list px-4">
        <q-item class="flex items-center" clickable v-ripple :to="{ name: 'dashboard' }" exact>
          <q-icon class="mr-3" size="22px" name="o_person" />
          <q-item-section>Profil</q-item-section>
        </q-item>
      </q-list> -->
    </q-drawer>

    <q-page-container>
      <div class="px-3 py-4 768:px-6 768:py-8"><router-view /></div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()

const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const userName = ref('Zafar Yusupov') // Bu yerda login qilingan foydalanuvchi ismini olish kerak

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  // Bu yerda logout logikasini yozish kerak
  router.push('/login')
}
</script>

<style lang="scss">
.menu-list .q-item {
  transition: background-color 0.2s;
  border-radius: 12px;
  margin-bottom: 8px;

  .q-item__section--avatar {
    min-width: 22px;
    padding-right: 12px;
  }
}
.menu-list .q-expansion-item__content .q-item {
  padding-left: 50px;
}
.menu-list .q-item:hover {
  background-color: #fcfeff;
}

.menu-list .q-item.q-router-link--active {
  background-color: #e4e9ff;
  color: var(--q-primary);
  font-weight: 500;
}
.menu-lis .q-item__section--avatar {
  width: auto !important;
}
.profile-dropdown {
  .q-btn-dropdown__arrow {
    margin-left: 8px;
  }
}
.menu-list-item.q-expansion-item--expanded {
  background-color: #fcfeff;
  border-radius: 12px;
}

.menu-list-item .q-expansion-item__container {
  border-radius: 12px;
  transition: background-color 0.2s;
}

.menu-list-item .q-expansion-item__container:hover {
  background-color: #fcfeff;
}
</style>
