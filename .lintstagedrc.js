/** @type {import('lint-staged').Config} */
module.exports = {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix', 'git add'],

  // JSON files
  '*.json': ['prettier --write', 'git add'],

  // Markdown files
  '*.md': ['prettier --write', 'git add'],

  // CSS and SCSS files
  '*.{css,scss}': ['prettier --write', 'git add'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write', 'git add'],

  // Type checking for TypeScript files (without fixing)
  '*.{ts,tsx}': () => 'tsc --noEmit',
};
