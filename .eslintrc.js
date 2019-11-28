module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
    },
    env: {
        node: true,
        browser: true,
    },

    globals: {
        axios: true,
        sessionStorage: true,
    },
    plugins: ["prettier"],

    extends: [
        'plugin:vue/recommended',
        "eslint:recommended"
    ],
    rules: {
        'vue/html-indent': [
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: [],
            },
        ],
        "vue/max-attributes-per-line": ["error", {
            "singleline": 5,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "never",
                "normal": "never",
                "component": "never"
            },
            "svg": "always",
            "math": "always"
        }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'quotes': ["error", "single"]
    },
};
