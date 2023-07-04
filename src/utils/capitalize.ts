export default function capitalize(words: string[]) {
  return words.map(
    word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase(),
  );
}
