// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    themePreference: null, // User's theme preference (null means not set, use system default)
  }),
  
  persist: true, // Enable persistence
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'Guest',
    userTheme: (state) => state.themePreference, // Get user's theme preference
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
    
    setThemePreference(theme) {
      // Save theme preference for current user
      this.themePreference = theme
      
      // Also save to localStorage with user-specific key if user is logged in
      if (process.client && this.user) {
        const userId = this.user.id || this.user.email || 'default'
        localStorage.setItem(`theme_${userId}`, theme)
      }
    },
    
    getThemePreference() {
      // Get theme preference for current user
      if (process.client && this.user) {
        const userId = this.user.id || this.user.email || 'default'
        const savedTheme = localStorage.getItem(`theme_${userId}`)
        if (savedTheme) {
          this.themePreference = savedTheme
          return savedTheme
        }
      }
      // Return stored preference or null
      return this.themePreference
    },
    
    logout() {
      this.user = null
      this.token = null
      this.themePreference = null
      const token = useCookie('auth_token')
      token.value = null
      navigateTo('/login')
    },
  },
})