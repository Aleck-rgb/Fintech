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
  // Разбиваем на блоки по двойным переносам строк
  const blocks = content.split(/\n\n+/)

  const renderedBlocks = blocks.map((block) => {
    const trimmed = block.trim()

    // Пропускаем пустые блоки
    if (!trimmed) return ""

    // Горизонтальная линия
    if (/^[-*_]{3,}$/.test(trimmed)) {
      return '<hr class="my-8 border-border" />'
    }

    // Заголовки
    if (trimmed.startsWith("### ")) {
      return `<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">${formatInline(trimmed.slice(4))}</h3>`
    }
    if (trimmed.startsWith("## ")) {
      return `<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">${formatInline(trimmed.slice(3))}</h2>`
    }
    if (trimmed.startsWith("# ")) {
      return `<h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">${formatInline(trimmed.slice(2))}</h1>`
    }

    // Списки (маркированные)
    if (/^[-*] /.test(trimmed)) {
      const items = trimmed.split(/\n/).map((line) => {
        const text = line.replace(/^[-*] /, "")
        return `<li class="mb-2">${formatInline(text)}</li>`
      })
      return `<ul class="list-disc pl-6 mb-6 text-muted-foreground space-y-1">${items.join("")}</ul>`
    }

    // Списки (нумерованные)
    if (/^\d+\. /.test(trimmed)) {
      const items = trimmed.split(/\n/).map((line) => {
        const text = line.replace(/^\d+\. /, "")
        return `<li class="mb-2">${formatInline(text)}</li>`
      })
      return `<ol class="list-decimal pl-6 mb-6 text-muted-foreground space-y-1">${items.join("")}</ol>`
    }

    // Цитаты
    if (trimmed.startsWith("> ")) {
      const text = trimmed.replace(/^> ?/gm, "")
      return `<blockquote class="border-l-4 border-accent pl-4 py-2 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg">${formatInline(text)}</blockquote>`
    }

    // Таблицы
    if (trimmed.includes("|")) {
      const rows = trimmed.split("\n").filter((row) => row.includes("|"))
      if (rows.length >= 2) {
        const headerRow = rows[0]
        const dataRows = rows.slice(2) // Пропускаем разделитель

        const headers = headerRow.split("|").filter((cell) => cell.trim() && !cell.includes("---"))
        const headerCells = headers
          .map(
            (cell) =>
              `<th class="border border-border px-4 py-2 bg-muted font-semibold text-left">${formatInline(cell.trim())}</th>`,
          )
          .join("")

        const bodyRows = dataRows
          .map((row) => {
            const cells = row.split("|").filter((cell) => cell.trim())
            return `<tr>${cells.map((cell) => `<td class="border border-border px-4 py-2">${formatInline(cell.trim())}</td>`).join("")}</tr>`
          })
          .join("")

        return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-border"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`
      }
    }

    // Обычный параграф
    return `<p class="mb-4 text-muted-foreground leading-relaxed">${formatInline(trimmed)}</p>`
  })

  return renderedBlocks.filter(Boolean).join("\n")
}

// Форматирование инлайн-элементов (жирный, курсив, ссылки, код)
function formatInline(text: string): string {
  return (
    text
      // Ссылки [text](url)
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-accent hover:underline">$1</a>')
      // Жирный текст
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Курсив
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // Инлайн-код
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
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
