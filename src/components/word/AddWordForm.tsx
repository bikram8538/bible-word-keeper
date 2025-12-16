import { useState } from "react";
import { Plus, X, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BibleWord, VerseReference } from "@/types/word";
import { toast } from "sonner";

interface AddWordFormProps {
  onSubmit: (word: Omit<BibleWord, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: BibleWord;
  isEditing?: boolean;
}

export function AddWordForm({ onSubmit, initialData, isEditing }: AddWordFormProps) {
  const [englishWord, setEnglishWord] = useState(initialData?.englishWord || "");
  const [bengaliMeanings, setBengaliMeanings] = useState<string[]>(
    initialData?.bengaliMeanings || [""]
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [verses, setVerses] = useState<VerseReference[]>(
    initialData?.verses || []
  );

  const addMeaning = () => {
    setBengaliMeanings([...bengaliMeanings, ""]);
  };

  const updateMeaning = (index: number, value: string) => {
    const updated = [...bengaliMeanings];
    updated[index] = value;
    setBengaliMeanings(updated);
  };

  const removeMeaning = (index: number) => {
    if (bengaliMeanings.length > 1) {
      setBengaliMeanings(bengaliMeanings.filter((_, i) => i !== index));
    }
  };

  const addVerse = () => {
    setVerses([
      ...verses,
      { id: crypto.randomUUID(), reference: "", text: "", chosenMeaning: "" },
    ]);
  };

  const updateVerse = (index: number, field: keyof VerseReference, value: string) => {
    const updated = [...verses];
    updated[index] = { ...updated[index], [field]: value };
    setVerses(updated);
  };

  const removeVerse = (index: number) => {
    setVerses(verses.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!englishWord.trim()) {
      toast.error("Please enter an English word");
      return;
    }

    const validMeanings = bengaliMeanings.filter((m) => m.trim());
    if (validMeanings.length === 0) {
      toast.error("Please add at least one Bengali meaning");
      return;
    }

    onSubmit({
      englishWord: englishWord.trim(),
      bengaliMeanings: validMeanings,
      notes: notes.trim(),
      verses: verses.filter((v) => v.reference.trim() || v.text.trim()),
    });

    if (!isEditing) {
      setEnglishWord("");
      setBengaliMeanings([""]);
      setNotes("");
      setVerses([]);
    }

    toast.success(isEditing ? "Word updated successfully!" : "Word saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* English Word */}
      <div className="space-y-2">
        <Label htmlFor="englishWord" className="text-base font-serif">
          English Word
        </Label>
        <Input
          id="englishWord"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          placeholder="e.g., GRACE"
          className="text-lg font-medium"
        />
      </div>

      {/* Bengali Meanings */}
      <div className="space-y-3">
        <Label className="text-base font-serif">Bengali Meanings</Label>
        {bengaliMeanings.map((meaning, index) => (
          <div key={index} className="flex gap-2 animate-scale-in">
            <Input
              value={meaning}
              onChange={(e) => updateMeaning(index, e.target.value)}
              placeholder={`Meaning ${index + 1} (e.g., অনুগ্রহ)`}
              className="text-lg"
            />
            {bengaliMeanings.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMeaning(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMeaning}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Meaning
        </Button>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-base font-serif">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why did you choose these meanings? Any context or explanation..."
          rows={3}
        />
      </div>

      {/* Bible Verses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-serif">Bible Verse References</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVerse}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Add Verse
          </Button>
        </div>

        {verses.map((verse, index) => (
          <Card key={verse.id} className="animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Verse {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVerse(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={verse.reference}
                onChange={(e) => updateVerse(index, "reference", e.target.value)}
                placeholder="Reference (e.g., Ephesians 2:8)"
              />
              <Textarea
                value={verse.text}
                onChange={(e) => updateVerse(index, "text", e.target.value)}
                placeholder="Verse text..."
                rows={2}
              />
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Chosen meaning for this verse
                </Label>
                <Input
                  value={verse.chosenMeaning}
                  onChange={(e) => updateVerse(index, "chosenMeaning", e.target.value)}
                  placeholder="Which Bengali meaning applies here?"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {verses.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Add Bible verses to provide context for your translations
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg">
        {isEditing ? "Update Word" : "Save Word"}
      </Button>
    </form>
  );
}
