module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
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
        'no-console' : 0,
        'no-cond-assign' : 0,
        'no-unused-vars': [
          'error',
          {'varsIgnorePattern': '^Preact$|_'},
        ],
        'react/react-in-jsx-scope': 0,
        'react/no-unknown-property': [2, {ignore: ['class']}]

    },

    "plugins": [
      "react"
    ]
};
