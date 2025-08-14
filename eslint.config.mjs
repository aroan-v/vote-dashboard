import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Next.js base rules
  ...compat.extends('next/core-web-vitals'),

  // ✅ React hooks plugin
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

  // ✅ No undefined variables
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-undef': 'error',
    },
  },

  // ✅ Unused imports/vars
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
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

  // ✅ Arrow function best practices
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-confusing-arrow': ['error', { allowParens: true }],
    },
  },

  // ✅ Prettier integration (must be last)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: ['prettier'],
  },
];

export default eslintConfig;
