export const placeholder: Word[] = [
  {
    id: "989e8d63-3ecb-4f3d-88ef-054f43dec4ef",
    name: "Stufi",
    transcription: "/ədˈhɪr/",
    createdById: "c2f5e9ba-0d19-44d9-958a-d1194e45f1f9",
    categories: [
      {
        id: "5beaed2d-5481-4238-a340-f3e44354b414",
        name: "Verb",
        meanings: [
          {
            id: "b5c60bb5-bdec-4d83-8b53-f6dcf645fe6f",
            definition: "Stick fast to (a surface or substance)",
            example: "Paint won't adhere well to a greasy surface",
          },
          {
            id: "0b7ed115-5c05-4224-805d-ad73061a30b0",
            definition: "Believe in and follow the practices of",
            example: "The people adhere to the Muslim religion",
          },
        ],
      },
    ],
  },
  {
    id: "bceb8cd1-4fa9-477b-ab7f-29d4c561a5e9",
    name: "Suit",
    transcription: "/hoʊm/",
    createdById: "c2f5e9ba-0d19-44d9-958a-d1194e45f1f9",
    categories: [
      {
        id: "c1455b87-91ef-4bb2-bf3c-3379bbbf59ef",
        name: "Noun",
        meanings: [
          {
            id: "2b0dbd27-eb6a-43dc-bea6-b4f4fd152212",
            definition:
              "A set of outer clothes made of the same fabric and designed to be worn together, typically consisting of a jacket and trousers or a jacket and skirt",
            example: "A pinstriped suit",
          },
          {
            id: "af1bf046-84c5-4f53-8c5a-31ffbb466c19",
            definition:
              "Any of the sets distinguished by their pictorial symbols into which a deck of playing cards is divided, in conventional decks comprising spades, hearts, diamonds, and clubs.",
          },
        ],
      },
      {
        id: "3c270e21-ffdc-4280-ba23-d4702ec8035f",
        name: "Verb",
        meanings: [
          {
            id: "ce068a49-ad80-4432-8405-35bc25677147",
            definition: "Be convenient for or acceptable to",
            example:
              "The apartment has two bedrooms—if it suits, you can have one of them",
          },
          {
            id: "6fad2592-e54b-4bd2-bfa3-e0bba1a25a0c",
            definition:
              "Go well with or enhance the features, figure, or character of (someone)",
            example: "The dress didn't suit her",
          },
        ],
      },
    ],
  },
  {
    id: "4e7bd104-2100-4bb6-9e7a-33e326850190",
    name: "Adhere",
    transcription: "/ədˈhɪr/",
    createdById: "c2f5e9ba-0d19-44d9-958a-d1194e45f1f9",
    categories: [
      {
        id: "8a17fd1f-2204-4122-a60d-8573cb602400",
        name: "Verb",
        meanings: [
          {
            id: "2f0765cf-8143-4196-9ca1-2b817ae533e6",
            definition: "Stick fast to (a surface or substance)",
            example: "Paint won't adhere well to a greasy surface",
          },
          {
            id: "a5889786-4bbf-4528-b323-36af83d101ed",
            definition: "Believe in and follow the practices of",
            example: "The people adhere to the Muslim religion",
          },
        ],
      },
    ],
  },
];

export interface Word {
  id: string;
  createdById: string;
  name: string;
  transcription: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  meanings: Meaning[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  id: string;
  definition: string;
  example?: string;
}
