<script setup>
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navigation = [
  {
    label: 'Dashboard',
    icon: 'lucide:home',
    to: '/',
  },
  {
    label: 'Patients',
    icon: 'lucide:inbox',
    to: '/inbox',
    
  },
  {
    label: 'Appointments',
    icon: 'lucide:users',
    to: '/customers',
  },
  {
    label: 'Settings',
    icon: 'lucide:settings',
    to: '/settings',
  },
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">My App</h1>
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :class="{
            'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': route.path === item.to,
          }"
          @click="sidebarOpen = false"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
          <span class="font-medium">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded-full"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- User Section - Fixed at bottom -->
      <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 mt-auto">
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {{ authStore.userName?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.userName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.email || 'user@example.com' }}
            </p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full mt-2 flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="lucide:log-out" class="w-5 h-5" />
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-full px-4 lg:px-6">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon name="lucide:menu" class="w-5 h-5" />
          </button>
          <div class="flex-1" />
          <div class="flex items-center gap-4">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Icon name="lucide:bell" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="min-h-[calc(100vh-4rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>
