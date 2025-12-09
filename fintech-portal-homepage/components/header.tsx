"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search } from "lucide-react"

const navItems = [
  { label: "Обзоры", href: "#reviews" },
  { label: "Переводы", href: "#transfers" },
  { label: "Обучение", href: "#education" },
  { label: "Аналитика", href: "#analytics" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              FinTech<span className="text-accent">Guide</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all">
              <Search className="mr-2 h-4 w-4" />
              Найти сервис
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4 border-t border-border/40 bg-background">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
            <Search className="mr-2 h-4 w-4" />
            Найти сервис
          </Button>
        </nav>
      </div>
    </header>
  )
}
