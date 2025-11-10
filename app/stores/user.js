import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    loggedIn: false,
  }),
  persist: true, // ✅ activates persisted state
})
