const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
  __dirname: 'readonly',
  module: 'readonly',
  require: 'readonly',
  exports: 'readonly',
  Buffer: 'readonly',
  setTimeout: 'readonly',
  setInterval: 'readonly',
  clearTimeout: 'readonly',
  clearInterval: 'readonly',
};

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...nodeGlobals,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      import: importPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-undef': 'error',
      
      // Import sorting and organization rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/no-cycle': 'off', // Disabled due to circular dependencies in type guard handlers
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-relative-parent-imports': 'off',
      
      // TypeScript-specific import rules
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      
      // Import grouping and organization
      'import/group-exports': 'off',
      'import/no-namespace': 'off',
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
]; 