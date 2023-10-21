export default function getFormattedDate(
  locale: string,
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "short" },
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}
