<script setup>
const route = useRoute()
const authStore = useAuthStore()

// Theme management
const colorMode = useColorMode()

// Local theme state for reliable toggling
const isDark = ref(false)

// Initialize sidebar state - open by default on desktop, closed on mobile
const sidebarOpen = ref(false)

// Toggle sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Function to apply theme
const applyTheme = (mode) => {
  if (process.client && typeof document !== 'undefined') {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
      isDark.value = true
    } else {
      document.documentElement.classList.remove('dark')
      isDark.value = false
    }
  }
}

// Toggle theme between light and dark
const toggleTheme = () => {
  // Toggle the local state
  isDark.value = !isDark.value
  
  const newTheme = isDark.value ? 'dark' : 'light'
  
  // Update colorMode preference
  colorMode.preference = newTheme
  
  // Save user's theme preference if logged in
  if (authStore.isAuthenticated) {
    authStore.setThemePreference(newTheme)
  }
  
  // Apply theme immediately
  applyTheme(newTheme)
}

// Initialize on mount
onMounted(() => {
  if (process.client && typeof document !== 'undefined') {
    // Initialize sidebar - open by default on desktop, closed on mobile
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        sidebarOpen.value = true // Open by default on desktop
      } else {
        sidebarOpen.value = false // Closed by default on mobile
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    // Cleanup resize listener
    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })
    
    // Initialize theme - prioritize user's saved preference
    let initialMode = 'light' // Default
    
    // Check if user is logged in and has a saved theme preference
    if (authStore.isAuthenticated) {
      const userTheme = authStore.getThemePreference()
      if (userTheme) {
        initialMode = userTheme
      } else {
        // If user is logged in but no preference saved, check general localStorage
        const savedTheme = localStorage.getItem('nuxt-color-mode') || colorMode.value
        initialMode = savedTheme === 'dark' ? 'dark' : 'light'
        // Save this as user's preference
        authStore.setThemePreference(initialMode)
      }
    } else {
      // Not logged in, use general localStorage or system preference
      const savedTheme = localStorage.getItem('nuxt-color-mode') || colorMode.value || 'light'
      initialMode = savedTheme === 'dark' ? 'dark' : 'light'
    }
    
    // Set local state
    isDark.value = initialMode === 'dark'
    
    // Apply initial theme
    applyTheme(initialMode)
    
    // Sync with colorMode
    colorMode.preference = initialMode
  }
})

// Watch for colorMode changes (from other sources)
watch(() => colorMode.value, (newMode) => {
  if (process.client && typeof document !== 'undefined') {
    const mode = newMode === 'dark' ? 'dark' : 'light'
    isDark.value = mode === 'dark'
    applyTheme(mode)
    
    // Save user's preference if logged in
    if (authStore.isAuthenticated) {
      authStore.setThemePreference(mode)
    }
  }
})

// Watch for user login to load their theme preference
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (process.client && isAuth && typeof document !== 'undefined') {
    // User just logged in, load their theme preference
    const userTheme = authStore.getThemePreference()
    if (userTheme) {
      const mode = userTheme === 'dark' ? 'dark' : 'light'
      isDark.value = mode === 'dark'
      applyTheme(mode)
      colorMode.preference = mode
    }
  }
})

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

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col',
        // Mobile: always slide in/out
        // Desktop: slide in/out based on sidebarOpen state
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">NHS-HOSPITAL</h1>
        <!-- <button
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        > -->
          <!-- <Icon name="lucide:list-collapse" class="w-5 h-5" />
        </button> -->
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

    <!-- Overlay for mobile when sidebar is open -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div :class="['transition-all duration-300 ease-in-out', sidebarOpen ? 'lg:pl-64' : 'lg:pl-0']">
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-full px-4 lg:px-6">
          <!-- Sidebar Toggle Button - Visible on all screen sizes -->
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :aria-label="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
            title="Toggle sidebar"
          >
            <Icon 
              :name="sidebarOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" 
              class="w-5 h-5 text-gray-700 dark:text-gray-200" 
            />
          </button>
          <div class="flex-1" />
          <div class="flex items-center gap-2">
            <!-- Theme Toggle Button -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              title="Toggle theme"
            >
              <Icon
                :name="isDark ? 'lucide:sun' : 'lucide:moon'"
                class="w-5 h-5 text-gray-700 dark:text-gray-200"
              />
            </button>
            <!-- Notifications Button -->
            <!-- <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Notifications"
            >
              <Icon name="lucide:bell" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button> -->
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
