import { Link, useLocation } from "react-router-dom";
import { BookOpen, Plus, Library } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Add Word", icon: Plus },
    { path: "/words", label: "All Words", icon: Library },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold text-foreground">
              Bible Translation Helper
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              English → Bengali Dictionary
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                location.pathname === path
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
