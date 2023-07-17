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
}

export interface Meaning {
  id: string;
  example?: string;
  definition: string;
}
