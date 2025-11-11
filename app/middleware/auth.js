// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie('auth_token')
  
  // Check if authenticated (store or cookie)
  if (!authStore.token && !tokenCookie.value) {
    return navigateTo('/login')
  }
  
  // Sync cookie to store if needed
  if (!authStore.token && tokenCookie.value) {
    authStore.token = tokenCookie.value
  }
})