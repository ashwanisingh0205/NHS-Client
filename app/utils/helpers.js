// utils/helpers.js
export const formatDate = (date, locale = 'en-US') => {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }
  
  export const truncate = (text, length = 100) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }
  
  export const debounce = (func, wait = 300) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }