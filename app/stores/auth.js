// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'Guest',
  },
  
  actions: {
    async login(credentials) {
      try {
        const api = useApi()
        const data = await api('/auth/login', {
          method: 'POST',
          body: credentials,
        })
        
        this.user = data.user
        this.token = data.token
        
        // Store token in cookie
        const token = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
        })
        token.value = data.token
        
        return data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async fetchUser() {
      try {
        const api = useApi()
        const data = await api('/auth/me')
        this.user = data.user
      } catch (error) {
        this.logout()
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      const token = useCookie('auth_token')
      token.value = null
      navigateTo('/login')
    },
  },
})