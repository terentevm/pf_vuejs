module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: [
        'vuetify'
    ],
    globals: {
        "axios": true,
        "sessionStorage": true
    },
    extends: [
        'plugin:vue/recommended'
    ],
    rules: {
        'vuetify/no-deprecated-classes': 'error',
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],

        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    }

};
