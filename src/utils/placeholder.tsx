export const placeholder: Word[] = [
  {
    name: "Suit",
    transcription: "/hoʊm/",
    createdById: "c2f5e9ba-0d19-44d9-958a-d1194e45f1f9",
    categories: [
      {
        name: "Noun",
        meanings: [
          {
            definition:
              "A set of outer clothes made of the same fabric and designed to be worn together, typically consisting of a jacket and trousers or a jacket and skirt",
            exampleSentences: ["A pinstriped suit"],
          },
          {
            definition:
              "Any of the sets distinguished by their pictorial symbols into which a deck of playing cards is divided, in conventional decks comprising spades, hearts, diamonds, and clubs.",
          },
        ],
      },
      {
        name: "Verb",
        meanings: [
          {
            definition: "Be convenient for or acceptable to",
            exampleSentences: [
              "The apartment has two bedrooms—if it suits, you can have one of them",
            ],
          },
          {
            definition:
              "Go well with or enhance the features, figure, or character of (someone)",
            exampleSentences: ["The dress didn't suit her"],
          },
        ],
      },
    ],
  },
  {
    name: "Adhere",
    transcription: "/ədˈhɪr/",
    createdById: "c2f5e9ba-0d19-44d9-958a-d1194e45f1f9",
    categories: [
      {
        name: "Verb",
        meanings: [
          {
            definition: "Stick fast to (a surface or substance)",
            exampleSentences: ["Paint won't adhere well to a greasy surface"],
          },
          {
            definition: "Believe in and follow the practices of",
            exampleSentences: ["The people adhere to the Muslim religion"],
          },
        ],
      },
    ],
  },
];

export interface Word {
  id?: string;
  createdById?: string;
  name: string;
  transcription?: string;
  categories: Category[];
}

interface Category {
  id?: string;
  wordId?: string;
  name: string;
  meanings: Meaning[];
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  id?: string;
  categoryId?: string;
  definition: string;
  exampleSentences?: string[];
}
