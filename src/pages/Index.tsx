import { Header } from "@/components/layout/Header";
import { AddWordForm } from "@/components/word/AddWordForm";
import { useWords } from "@/hooks/useWords";
import { BookOpen, Sparkles } from "lucide-react";

const Index = () => {
  const { addWord, words } = useWords();

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <Header />
      
      <main className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Your Personal Translation Memory</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Add a New Word
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Save English words with their Bengali meanings and Bible verse context
              for consistent translation.
            </p>
          </div>

          {/* Stats */}
          {words.length > 0 && (
            <div className="flex items-center justify-center gap-6 mb-8 animate-slide-up">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">{words.length}</span>
                <span>word{words.length !== 1 ? "s" : ""} saved</span>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="glass-card rounded-xl p-6 md:p-8">
            <AddWordForm onSubmit={addWord} />
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border/50 animate-fade-in">
            <h3 className="font-serif font-semibold text-foreground mb-2">
              💡 Translation Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Add multiple Bengali meanings to capture different contexts</li>
              <li>• Include Bible verses to remember which meaning fits where</li>
              <li>• Use notes to explain your translation decisions</li>
              <li>• Visit "All Words" to revise before translating new chapters</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
