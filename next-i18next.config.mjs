import path from "path";

const localePath = path.resolve('./public/locales')
/** @type {import("next-i18next").UserConfig} */
const config = {
  i18n: {
    locales: ["en", "ua"],
    defaultLocale: "en",
  },
  localePath,
  reloadOnPrerender: true,
};
export default config;
