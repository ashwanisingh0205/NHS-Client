// plugins/toast.client.js
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Register toast plugin with professional settings
  nuxtApp.vueApp.use(Toast, {
    position: 'top-right',
    timeout: 4000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
    maxToasts: 5,
    newestOnTop: true,
    transition: 'Vue-Toastification__bounce',
    transitionDuration: 750,
  })
  
  // Make toast available on nuxtApp.$toast
  nuxtApp.$toast = nuxtApp.vueApp.config.globalProperties.$toast
})

