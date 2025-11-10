<!-- pages/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Welcome to My App</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ item.title }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ item.description }}</p>
        <UiButton @click="handleItemClick(item)">
          View Details
        </UiButton>
      </div>
    </div>
    
    <div v-if="loading" class="text-center mt-8">
      <Icon name="eos-icons:loading" class="text-4xl animate-spin text-primary-500" />
    </div>
  </div>
</template>

<script setup>
// Protect this page - require authentication
definePageMeta({
  middleware: 'auth', // Redirect to login if not authenticated
  layout: 'default', // Use default layout
})

// SEO Meta tags
useSeoMeta({
  title: 'Home - My App',
  description: 'Welcome to my professional Nuxt application',
  ogTitle: 'Home - My App',
  ogDescription: 'Welcome to my professional Nuxt application',
})

// State
const items = ref([
  {
    id: 1,
    title: 'Dashboard',
    description: 'View your dashboard and analytics',
  },
  {
    id: 2,
    title: 'Projects',
    description: 'Manage your projects and tasks',
  },
  {
    id: 3,
    title: 'Reports',
    description: 'Generate and view reports',
  },
  {
    id: 4,
    title: 'Settings',
    description: 'Configure your application settings',
  },
  {
    id: 5,
    title: 'Profile',
    description: 'Update your profile information',
  },
  {
    id: 6,
    title: 'Notifications',
    description: 'View and manage notifications',
  },
])
const loading = ref(false)

// Methods
const handleItemClick = (item) => {
  // Navigate to item detail page
  navigateTo(`/items/${item.id}`)
}
</script>