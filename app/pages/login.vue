<script setup lang="ts">
import hospitalImage from '~/assets/images/hospital.jpg'

definePageMeta({
  layout: false,
})

// Form state
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errors = ref({
  username: '',
  password: '',
  general: '',
})

// Composables
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Validation
const validateForm = () => {
  errors.value = { username: '', password: '', general: '' }
  let isValid = true

  // Username validation
  const usernameTrimmed = username.value?.trim() || ''
  if (!usernameTrimmed) {
    errors.value.username = 'Username or email is required'
    isValid = false
  } else if (usernameTrimmed.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
    isValid = false
  }

  // Password validation
  const passwordTrimmed = password.value?.trim() || ''
  if (!passwordTrimmed) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (passwordTrimmed.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

//api call to login
//  try {
//     // Call the login action from the store
//     await authStore.login({
//       email: username.value.trim(),
//       password: password.value.trim(),
//     })

//     // Show success message
//     toast.success('Login successful! Welcome back.')
   // Navigate to home page after successful login
//     await router.push('/')
//   } catch (error: any) {
//     // Handle error
//     const errorMessage =
//       error?.response?.data?.message ||
//       error?.message ||
//       'Login failed. Please check your credentials and try again.'
//     errors.value.general = errorMessage
//     toast.error(errorMessage)
//   } finally {
//     loading.value = false
//   }

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Handle login
async function handleLogin() {
  // Clear previous errors
  errors.value = { username: '', password: '', general: '' }

  // Validate form
  if (!validateForm()) {
    return
  }

  loading.value = true

  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Set authentication state (no API call)
  const mockToken = 'token_' + Date.now()
  authStore.token = mockToken
  authStore.user = {
    id: username.value.trim(), // Use username as ID for theme storage
    name: username.value.trim(),
    email: username.value.trim(),
  }

  // Store token in cookie
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })
  token.value = mockToken

  // Store remember me preference
  if (rememberMe.value) {
    const rememberCookie = useCookie('remember_me', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    rememberCookie.value = 'true'
  }



  // Show success message
  toast.success('Login successful! Welcome back.')

  // Navigate to index page
  await router.push('/')
  
  loading.value = false
}

// Clear error on input
const clearError = (field: 'username' | 'password') => {
  errors.value[field] = ''
  if (errors.value.general) {
    errors.value.general = ''
  }
}

// Handle Enter key press
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !loading.value) {
    handleLogin()
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <!-- Background Image with Blur -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${hospitalImage})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-cyan-900/70 to-teal-800/80 dark:from-gray-900/90 dark:via-gray-950/90 dark:to-gray-900/90"></div>
      <div class="absolute inset-0 backdrop-blur-0"></div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-md relative z-10">
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20 dark:border-gray-700/50"
      >
        <!-- Logo/Header Section -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white mb-4 shadow-lg"
          >
            <Icon name="lucide:hospital" class="w-10 h-10" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hospital Management System
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Secure access for healthcare professionals
          </p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="errors.general"
          class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
        >
          <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p class="text-sm text-red-800 dark:text-red-300">{{ errors.general }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username/Email Field -->
          <div>
            <label
              for="username"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Staff ID or Email
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Icon
                  name="lucide:user-circle"
                  class="h-5 w-5 text-teal-500 dark:text-teal-400"
                />
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                autocomplete="username"
                :class="[
                  'block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400',
                  errors.username
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
                placeholder="Enter your staff ID or email"
                :disabled="loading"
                autofocus
                @input="clearError('username')"
                @keypress="handleKeyPress"
              />
            </div>
            <p v-if="errors.username" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.username }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
              <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Icon
                  name="lucide:lock"
                  class="h-5 w-5 text-teal-500 dark:text-teal-400"
                />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                :class="[
                  'block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400',
                  errors.password
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
                placeholder="Enter your password"
                :disabled="loading"
                @input="clearError('password')"
                @keypress="handleKeyPress"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                @click="togglePasswordVisibility"
              >
                <Icon
                  :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                  class="h-5 w-5"
                />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer group">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-teal-600 dark:ring-offset-gray-800"
                :disabled="loading"
              />
              <span
                class="ml-2 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
              >
                Remember me
              </span>
            </label>
            <button
              type="button"
              class="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
              :disabled="loading"
            >
              Forgot password?
            </button>
          </div>

          <!-- Sign In Button -->
          <button
            type="submit"
            :disabled="loading || !username.trim() || !password.trim()"
            :class="[
              'w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <Icon
                name="eos-icons:loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              />
              Authenticating...
            </span>
            <span v-else class="flex items-center">
              <Icon name="lucide:log-in" class="mr-2 h-5 w-5" />
              Access System
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          
        </div>
      </div>

      <!-- Additional Info -->
      
    </div>
  </div>
</template>

