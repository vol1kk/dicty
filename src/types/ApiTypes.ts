export interface Word {
  id: string;
  name: string;
  createdById: string;
  transcription: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  meanings: Meaning[];
  wordId: string;
}

export interface Meaning {
  id: string;
  example: string | null;
  definition: string;
}
