import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    {
        ignores: ['**/generated/', '**/node_modules/', '**/session'],
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
];
