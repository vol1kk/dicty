import { type Word, WordSchema } from "~/types/ApiTypes";

export default function readFileAsync(file: File): Promise<Word[]> {
  return new Promise((resolve, reject) => {
    if (file.type !== "application/json")
      throw new Error("File should be of .json format!");

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = e => {
      const data = e.target?.result;

      if (typeof data === "string") {
        const parsedWords = JSON.parse(data) as Word[];

        const validatedWords = parsedWords.map(w => WordSchema.safeParse(w));
        const isValid = validatedWords.every(res => res.success);

        if (isValid) resolve(parsedWords);
        if (!isValid) resolve([]);
      }
    };
    fileReader.onerror = e => reject(e.target?.error);
  });
}
