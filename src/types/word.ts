export interface VerseReference {
  id: string;
  reference: string; // e.g., "Ephesians 2:8"
  text: string; // The verse text
  chosenMeaning: string; // Which Bengali meaning applies here
}

export interface BibleWord {
  id: string;
  englishWord: string;
  bengaliMeanings: string[];
  notes: string;
  verses: VerseReference[];
  createdAt: string;
  updatedAt: string;
}
