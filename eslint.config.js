// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        files: ["src/**"],
        rules: {
            "semi": ["error", "always"], // semicolons
            "indent": ["error", "tab"], // tabs indents
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double"]
        }
    },
    eslint.configs.recommended,
    ...tseslint.configs.stylistic,
);