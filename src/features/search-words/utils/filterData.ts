export default function filterData<T extends { name: string }>(
  data: T[],
  query: string,
  matchThreshold = 0.35, // If query and word shares less than 35% of characters, return false
  matchCharDiff = 3, // If query and word shares 35% of characters, but has too many random symbols, return false
) {
  // If query is empty, show all items
  if (query === "") return data;

  // If query fully matches name, show single item
  const searchByName = data.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase()),
  );
  if (searchByName.length >= 1) return searchByName;

  // If query doesn't match anything, then try finding item by similar characters
  const searchByCharacterOccurrences = data.reduce((data, i) => {
    const characters = i.name.toLowerCase().split("");

    const matchedCharacters = characters.filter(char => query.includes(char));
    const matchedPercent = matchedCharacters.length / i.name.length;
    const charDiff = Math.abs(characters.length - query.length);

    if (matchedPercent >= matchThreshold && charDiff <= matchCharDiff)
      data.push([matchedPercent, i]);

    return data;
  }, [] as [number, T][]);
  return searchByCharacterOccurrences.sort(([a], [b]) => b - a).map(i => i[1]);
}
