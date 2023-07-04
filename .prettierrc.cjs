const config = {
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80,
  "spaceBeforeFunctionParen": false,
  "arrowParens": "avoid",
  "endOfLine": "auto",
  plugins: [require('prettier-plugin-tailwindcss')],
}

module.exports = config;
