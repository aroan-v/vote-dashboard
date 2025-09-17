// eslint.config.js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // ✅ Next.js rules (legacy extends, converted for flat config)
  ...compat.extends('next/core-web-vitals'),

  // ✅ React hooks
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // ✅ No undefined vars
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-undef': 'error',
    },
  },

  // ✅ Unused imports
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // ✅ Arrow fn best practices
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-confusing-arrow': ['error', { allowParens: true }],
    },
  },

  // ✅ Prettier (must also use compat)
  ...compat.extends('prettier'),
]

export default eslintConfig
