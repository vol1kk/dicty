import path from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')} --max-warnings=0`

export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
