export default function getUniqueDictionaries<
  T extends { dictionary: string | null },
>(data: T[]) {
  return [
    ...new Set(
      data
        .filter(w => w.dictionary)
        .map(el1 => (el1.dictionary as string).toLowerCase()),
    ),
  ];
}
