<script setup>
import { ref, computed } from 'vue'

// Define props
const props = defineProps({
  label: String,
  color: { type: String, default: 'primary' },
  variant: { type: String, default: 'solid' },
  size: { type: String, default: 'md' },
  to: [String, Object],
  target: String,
  type: { type: String, default: 'button' },
  block: Boolean,
  leadingIcon: String,
  trailingIcon: String,
  icon: String, // Single icon (for icon-only buttons)
  iconOnly: Boolean, // Show only icon, no text
  disabled: Boolean,
  loading: Boolean,
  loadingAuto: Boolean,
  onClick: Function, // Callback function that can return a Promise
  ariaLabel: String,
})

// Local state for auto-loading
const autoLoading = ref(false)

// Base classes
const baseClass =
  'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

// Color variants
const colors = {
  primary: {
    solid: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50',
    link: 'text-blue-600 underline underline-offset-4 hover:text-blue-700',
  },
  success: {
    solid: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus-visible:ring-green-500',
    ghost: 'text-green-600 hover:bg-green-50',
    link: 'text-green-600 underline underline-offset-4 hover:text-green-700',
  },
  error: {
    solid: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus-visible:ring-red-500',
    ghost: 'text-red-600 hover:bg-red-50',
    link: 'text-red-600 underline underline-offset-4 hover:text-red-700',
  },
  neutral: {
    solid: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-400',
    ghost: 'text-gray-700 hover:bg-gray-100',
    link: 'text-gray-700 underline underline-offset-4 hover:text-gray-900',
  },
  brand: {
    solid: 'bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand',
    outline: 'border border-brand text-brand hover:bg-brand-light/10 focus-visible:ring-brand',
    ghost: 'text-brand hover:bg-brand-light/10',
    link: 'text-brand underline underline-offset-4 hover:text-brand-dark',
  },
}

// Size variants
const sizes = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
  xl: 'text-lg px-6 py-3',
}

// Icon size variants
const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
}

// Compute loading state
const isLoading = computed(() => props.loading || autoLoading.value)

// Compute classes
const classes = computed(() => {
  const sizeClass = props.iconOnly 
    ? {
        xs: 'p-1.5',
        sm: 'p-2',
        md: 'p-2.5',
        lg: 'p-3',
        xl: 'p-3.5',
      }[props.size] || 'p-2.5'
    : sizes[props.size]
    
  return [
    baseClass,
    sizeClass,
    colors[props.color]?.[props.variant],
    {
      'w-full': props.block,
      'opacity-70 pointer-events-none': isLoading.value,
      'rounded-full aspect-square': props.iconOnly,
    },
  ]
})

// Determine tag (always use button, navigation handled programmatically)
const componentTag = computed(() => 'button')

const extraAttrs = computed(() => {
  return { 
    type: props.type, 
    disabled: props.disabled || isLoading.value 
  }
})

// Emit click event
const emit = defineEmits(['click'])

async function handleClick(event) {
  // Auto-loading logic
  if (props.loadingAuto) {
    autoLoading.value = true
    
    try {
      let promise = null
      
      // Try to get promise from onClick callback prop
      if (props.onClick && typeof props.onClick === 'function') {
        const result = props.onClick(event)
        if (result && typeof result.then === 'function') {
          promise = result
        }
      }
      
      // If no promise from onClick, try emit (for backward compatibility)
      if (!promise) {
        emit('click', event)
      }
      
      // If we have a promise, await it
      if (promise) {
        await promise
      } else if (props.to && !props.disabled) {
        // If no promise but we have 'to', navigate
        await navigateTo(props.to)
      }
    } catch (e) {
      console.error('NXTButton action failed:', e)
    } finally {
      autoLoading.value = false
    }
    return
  }
  
  // Normal click handling
  if (props.onClick && typeof props.onClick === 'function') {
    props.onClick(event)
  } else {
    emit('click', event)
  }
  
  // If 'to' prop is provided, navigate programmatically
  if (props.to && !props.disabled && !isLoading.value) {
    await navigateTo(props.to)
  }
}
</script>

<template>
  <component
    :is="componentTag"
    v-bind="extraAttrs"
    :class="classes"
    :aria-busy="isLoading ? 'true' : undefined"
    :aria-label="ariaLabel || label"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <Transition name="fade" mode="out-in">
      <span
        v-if="isLoading"
        key="spinner"
        class="inline-block h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"
        aria-hidden="true"
      ></span>
    </Transition>

    <!-- Content -->
    <Transition name="fade" mode="out-in">
      <span v-if="!isLoading" key="content" class="flex items-center justify-center gap-2">
        <!-- Icon-only mode -->
        <template v-if="iconOnly || icon">
          <Icon 
            v-if="(icon || leadingIcon) && (icon || leadingIcon).includes(':')" 
            :name="icon || leadingIcon" 
            :class="iconSizes[props.size]"
          />
          <i 
            v-else-if="icon || leadingIcon" 
            :class="[icon || leadingIcon, iconSizes[props.size]]"
          ></i>
        </template>
        
        <!-- Normal mode with icons and text -->
        <template v-else>
          <!-- Leading Icon -->
          <Icon 
            v-if="leadingIcon && leadingIcon.includes(':')" 
            :name="leadingIcon" 
            :class="iconSizes[props.size]"
          />
          <i 
            v-else-if="leadingIcon" 
            :class="[leadingIcon, iconSizes[props.size]]"
          ></i>
          
          <!-- Button Content -->
          <slot>{{ label }}</slot>
          
          <!-- Trailing Icon -->
          <Icon 
            v-if="trailingIcon && trailingIcon.includes(':')" 
            :name="trailingIcon" 
            :class="iconSizes[props.size]"
          />
          <i 
            v-else-if="trailingIcon" 
            :class="[trailingIcon, iconSizes[props.size]]"
          ></i>
        </template>
      </span>
    </Transition>
  </component>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>