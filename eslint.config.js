// @ts-check

import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.json',
            },
        },
    },
    {
        files: ["src/**"],
        rules: {
            "semi": ["error", "always"], // semicolons
            "indent": ["error", "tab"], // tabs indents
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double"],
        },
    },
);