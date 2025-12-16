import { BibleWord } from "@/types/word";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface WordCardProps {
  word: BibleWord;
  onClick: () => void;
}

export function WordCard({ word, onClick }: WordCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer group hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-slide-up"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-serif text-foreground group-hover:text-primary transition-colors">
            {word.englishWord}
          </CardTitle>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {word.bengaliMeanings.map((meaning, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-base font-normal px-3 py-1"
            >
              {meaning}
            </Badge>
          ))}
        </div>

        {word.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {word.notes}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {word.verses.length} verse{word.verses.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(word.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
