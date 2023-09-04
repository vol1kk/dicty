/** @type {import("prettier").Config} */
const config = {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  printWidth: 80,
  arrowParens: "avoid",
  endOfLine: "auto",
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
