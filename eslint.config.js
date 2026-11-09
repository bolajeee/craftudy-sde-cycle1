const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  prettier, // must be last: turns off ESLint rules that fight Prettier
];
