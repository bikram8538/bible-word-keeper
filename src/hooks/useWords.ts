import { useState, useEffect, useCallback } from "react";
import { BibleWord } from "@/types/word";

const STORAGE_KEY = "bible-translation-words";

export function useWords() {
  const [words, setWords] = useState<BibleWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load words from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWords(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored words:", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save words to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    }
  }, [words, isLoading]);

  const addWord = useCallback((word: Omit<BibleWord, "id" | "createdAt" | "updatedAt">) => {
    const newWord: BibleWord = {
      ...word,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWords((prev) => [...prev, newWord]);
    return newWord;
  }, []);

  const updateWord = useCallback((id: string, updates: Partial<Omit<BibleWord, "id" | "createdAt">>) => {
    setWords((prev) =>
      prev.map((word) =>
        word.id === id
          ? { ...word, ...updates, updatedAt: new Date().toISOString() }
          : word
      )
    );
  }, []);

  const deleteWord = useCallback((id: string) => {
    setWords((prev) => prev.filter((word) => word.id !== id));
  }, []);

  const getWordById = useCallback((id: string) => {
    return words.find((word) => word.id === id);
  }, [words]);

  const searchWords = useCallback((query: string) => {
    const lower = query.toLowerCase();
    return words.filter(
      (word) =>
        word.englishWord.toLowerCase().includes(lower) ||
        word.bengaliMeanings.some((m) => m.includes(query)) ||
        word.notes.toLowerCase().includes(lower)
    );
  }, [words]);

  return {
    words,
    isLoading,
    addWord,
    updateWord,
    deleteWord,
    getWordById,
    searchWords,
  };
}
