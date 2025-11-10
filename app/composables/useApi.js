// composables/useApi.js
export const useApi = () => {
    const config = useRuntimeConfig()
    
    const api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        // Add auth token
        const token = useCookie('auth_token').value
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        }
      },
      onResponseError({ response }) {
        // Handle errors globally
        if (response.status === 401) {
          // Redirect to login
          navigateTo('/login')
        }
        
        // Toast notification for errors
        console.error('API Error:', response._data)
      },
    })
  
    return api
  }