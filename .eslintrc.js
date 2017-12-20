module.exports = {
  extends: 'react-app',
  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': 'error',
  },
}
