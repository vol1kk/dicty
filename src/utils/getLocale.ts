export default function getLocale(locale: string) {
  switch (locale) {
    case "en":
      return "en-us";
    case "ua":
      return "uk-ua";

    default:
      return "en-us";
  }
}
