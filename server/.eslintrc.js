module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "browser": true,
        "node": true,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-console": 0,
        "no-cond-assign": 0,
        "no-unused-vars": ["error", { "argsIgnorePattern": "^next$|^_$" }],
    }
};
