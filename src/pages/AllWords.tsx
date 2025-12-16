import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { WordCard } from "@/components/word/WordCard";
import { WordDetail } from "@/components/word/WordDetail";
import { useWords } from "@/hooks/useWords";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SortAsc, Clock, BookOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { BibleWord } from "@/types/word";

type SortOption = "alphabetical" | "recent" | "oldest";

const AllWords = () => {
  const { words, isLoading, updateWord, deleteWord } = useWords();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [selectedWord, setSelectedWord] = useState<BibleWord | null>(null);

  const filteredAndSortedWords = useMemo(() => {
    let result = words;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (word) =>
          word.englishWord.toLowerCase().includes(query) ||
          word.bengaliMeanings.some((m) => m.includes(searchQuery)) ||
          word.notes.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "alphabetical":
        result = [...result].sort((a, b) =>
          a.englishWord.localeCompare(b.englishWord)
        );
        break;
      case "recent":
        result = [...result].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [words, searchQuery, sortBy]);

  if (selectedWord) {
    const currentWord = words.find((w) => w.id === selectedWord.id);
    if (currentWord) {
      return (
        <div className="min-h-screen bg-background parchment-texture">
          <Header />
          <main className="container py-8 md:py-12">
            <div className="max-w-3xl mx-auto">
              <WordDetail
                word={currentWord}
                onBack={() => setSelectedWord(null)}
                onUpdate={updateWord}
                onDelete={deleteWord}
              />
            </div>
          </main>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <Header />

      <main className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Your Translation Dictionary
            </h1>
            <p className="text-muted-foreground text-lg">
              Review and revise all your saved words for consistent translation
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search words, meanings, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">
                  <span className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    Alphabetical
                  </span>
                </SelectItem>
                <SelectItem value="recent">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Most Recent
                  </span>
                </SelectItem>
                <SelectItem value="oldest">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Oldest First
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-sm text-muted-foreground">
              {filteredAndSortedWords.length} of {words.length} word
              {words.length !== 1 ? "s" : ""}
              {searchQuery && " found"}
            </span>
          </div>

          {/* Word List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">
                Loading your words...
              </div>
            </div>
          ) : filteredAndSortedWords.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredAndSortedWords.map((word, index) => (
                <div
                  key={word.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <WordCard
                    word={word}
                    onClick={() => setSelectedWord(word)}
                  />
                </div>
              ))}
            </div>
          ) : words.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                No Words Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start building your Bible translation dictionary by adding your
                first word.
              </p>
              <Button asChild>
                <Link to="/" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Word
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No Results Found
              </h3>
              <p className="text-muted-foreground">
                Try a different search term or clear your search.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllWords;
