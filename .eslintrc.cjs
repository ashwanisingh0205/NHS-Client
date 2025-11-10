// .eslintrc.cjs
module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2022: true,
    },
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: false,
      },
    },
    extends: [
      '@nuxtjs/eslint-config-typescript',
      'plugin:vue/vue3-recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    overrides: [
      {
        files: ['*.js', '*.jsx'],
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
        },
      },
    ],
  }
