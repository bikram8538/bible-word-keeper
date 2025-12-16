import { useState } from "react";
import { BibleWord } from "@/types/word";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { AddWordForm } from "./AddWordForm";

interface WordDetailProps {
  word: BibleWord;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<BibleWord>) => void;
  onDelete: (id: string) => void;
}

export function WordDetail({ word, onBack, onUpdate, onDelete }: WordDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updates: Omit<BibleWord, "id" | "createdAt" | "updatedAt">) => {
    onUpdate(word.id, updates);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Words
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{word.englishWord}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this word and all its meanings and verse references.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(word.id);
                    onBack();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Word Title */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
          {word.englishWord}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Added {format(new Date(word.createdAt), "MMMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Bengali Meanings */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-serif font-semibold mb-4">Bengali Meanings</h3>
          <div className="flex flex-wrap gap-3">
            {word.bengaliMeanings.map((meaning, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xl px-4 py-2 font-normal"
              >
                {meaning}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {word.notes && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-serif font-semibold mb-3">Notes</h3>
            <p className="text-foreground/80 whitespace-pre-wrap">{word.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Verse References */}
      {word.verses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Bible Verse References
          </h3>
          {word.verses.map((verse) => (
            <Card key={verse.id}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary">{verse.reference}</h4>
                  {verse.chosenMeaning && (
                    <Badge variant="outline" className="text-sm">
                      → {verse.chosenMeaning}
                    </Badge>
                  )}
                </div>
                {verse.text && (
                  <blockquote className="verse-highlight text-foreground/90">
                    "{verse.text}"
                  </blockquote>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              Edit "{word.englishWord}"
            </DialogTitle>
          </DialogHeader>
          <AddWordForm
            onSubmit={handleUpdate}
            initialData={word}
            isEditing
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
