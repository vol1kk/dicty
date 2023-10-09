export default function getUniqueDictionaries<
  T extends { dictionary: string | null },
>(data: T[]) {
  return [
    ...new Set(data.map(el1 => (el1.dictionary as string).toLowerCase())),
  ];
}
