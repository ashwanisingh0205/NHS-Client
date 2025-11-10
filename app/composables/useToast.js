// composables/useToast.js
export const useToast = () => {
  const nuxtApp = useNuxtApp()
  
  // Check if toast is available (client-side only)
  if (process.client && nuxtApp.$toast) {
    return {
      success: (message) => nuxtApp.$toast.success(message),
      error: (message) => nuxtApp.$toast.error(message),
      warning: (message) => nuxtApp.$toast.warning(message),
      info: (message) => nuxtApp.$toast.info(message),
    }
  }
  
  // Fallback for server-side or when toast is not available
  return {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
  }
}

