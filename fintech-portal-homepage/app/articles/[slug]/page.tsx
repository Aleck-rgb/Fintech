import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import Link from "next/link"

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return { title: "Статья не найдена" }
  }

  return {
    title: `${article.title} | FinTechGuide`,
    description: article.description,
  }
}

// Простой рендерер Markdown в HTML
function renderMarkdown(content: string): string {
  return (
    content
      // Заголовки
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">$1</h1>')
      // Жирный и курсив
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Списки
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 mb-2 list-decimal">$2</li>')
      // Таблицы (базовая поддержка)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").filter((cell) => cell.trim())
        if (cells.some((cell) => cell.includes("---"))) {
          return ""
        }
        const isHeader = !match.includes("---")
        const cellTag = isHeader ? "td" : "td"
        return `<tr>${cells.map((cell) => `<${cellTag} class="border border-border px-4 py-2">${cell.trim()}</${cellTag}>`).join("")}</tr>`
      })
      // Параграфы
      .replace(/^(?!<[h|l|t])(.*$)/gm, (match) => {
        if (match.trim() === "") return "<br/>"
        if (match.startsWith("<")) return match
        return `<p class="mb-4 text-muted-foreground leading-relaxed">${match}</p>`
      })
  )
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Все статьи
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <Badge className="mb-4 bg-accent text-accent-foreground">{article.category}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{article.description}</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl mb-10">
          <img src={article.image || "/placeholder.svg"} alt={article.title} className="h-full w-full object-cover" />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />

        {/* Back to Articles */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться к статьям
          </Link>
        </div>
      </article>
    </main>
  )
}
