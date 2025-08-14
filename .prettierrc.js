const isScaffold = process.env.NEW_COMPONENT === 'true'

// NEW_COMPONENT=true npx new-component MyComponent

module.exports = {
  singleQuote: true,
  semi: false,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: isScaffold ? [] : ['prettier-plugin-tailwindcss'],
}
