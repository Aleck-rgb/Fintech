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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = getArticleBySlug(slug)

  if (!article) {
    return { title: "Статья не найдена" }
  }

  return {
    title: `${article.title} | FinTechGuide`,
    description: article.description,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  function parseMarkdown(content: string): string {
    // Нормализуем переносы строк
    let html = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

    // Убираем экранирование специальных символов
    html = html.replace(/\\([.~*_`#\-[\](){}+!|])/g, "$1")

    // Заменяем стрелки
    html = html.replace(/->/g, "→")
    html = html.replace(/<-/g, "←")

    // Разбиваем на блоки для обработки
    const blocks = html.split(/\n{2,}/)
    const processedBlocks: string[] = []

    let i = 0
    while (i < blocks.length) {
      const block = blocks[i].trim()

      if (!block) {
        i++
        continue
      }

      // Проверяем таблицу (начинается с |)
      if (block.startsWith("|") && block.includes("\n")) {
        const tableHtml = parseTable(block)
        if (tableHtml) {
          processedBlocks.push(tableHtml)
          i++
          continue
        }
      }

      // Горизонтальная линия
      if (/^(-{3,}|_{3,}|\*{3,})$/.test(block)) {
        processedBlocks.push('<hr class="my-8 border-t-2 border-border" />')
        i++
        continue
      }

      // Заголовки
      if (block.startsWith("#")) {
        processedBlocks.push(parseHeading(block))
        i++
        continue
      }

      // Цитаты
      if (block.startsWith(">")) {
        processedBlocks.push(parseBlockquote(block))
        i++
        continue
      }

      // Списки (маркированные)
      if (/^[-*•]\s/.test(block)) {
        processedBlocks.push(parseUnorderedList(block))
        i++
        continue
      }

      // Списки (нумерованные)
      if (/^\d+\.\s/.test(block)) {
        processedBlocks.push(parseOrderedList(block))
        i++
        continue
      }

      // Обычный параграф
      processedBlocks.push(parseParagraph(block))
      i++
    }

    return processedBlocks.join("\n\n")
  }

  function parseTable(block: string): string | null {
    const lines = block.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return null

    // Проверяем, что вторая строка - разделитель
    const separatorLine = lines[1]
    if (!/^\|[\s\-:|]+\|$/.test(separatorLine.trim())) return null

    const headerCells = lines[0]
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
    const headerHtml = headerCells
      .map(
        (h) =>
          `<th class="border border-border px-4 py-3 bg-muted font-semibold text-left text-foreground">${formatInline(h)}</th>`,
      )
      .join("")

    const bodyRows = lines
      .slice(2)
      .map((row) => {
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean)
        const cellsHtml = cells
          .map((c) => `<td class="border border-border px-4 py-3 text-muted-foreground">${formatInline(c)}</td>`)
          .join("")
        return `<tr class="hover:bg-muted/50 transition-colors">${cellsHtml}</tr>`
      })
      .join("")

    return `<div class="overflow-x-auto my-8 rounded-lg border border-border"><table class="w-full border-collapse text-sm"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyRows}</tbody></table></div>`
  }

  function parseHeading(block: string): string {
    const match = block.match(/^(#{1,6})\s+(.+)$/)
    if (!match) return parseParagraph(block)

    const level = match[1].length
    const text = formatInline(match[2])

    const styles: Record<number, string> = {
      1: "text-4xl font-bold text-foreground mt-10 mb-6",
      2: "text-3xl font-bold text-foreground mt-10 mb-4",
      3: "text-2xl font-bold text-foreground mt-8 mb-4",
      4: "text-xl font-semibold text-foreground mt-8 mb-4",
      5: "text-lg font-semibold text-foreground mt-6 mb-3",
      6: "text-base font-semibold text-foreground mt-6 mb-3",
    }

    return `<h${level} class="${styles[level]}">${text}</h${level}>`
  }

  function parseBlockquote(block: string): string {
    const lines = block.split("\n").map((line) => line.replace(/^>\s?/, ""))
    const content = lines.map((line) => formatInline(line)).join("<br />")
    return `<blockquote class="border-l-4 border-accent pl-6 py-2 my-6 text-muted-foreground italic bg-muted/30 rounded-r-lg">${content}</blockquote>`
  }

  function parseUnorderedList(block: string): string {
    const items = block.split("\n").filter((line) => /^[-*•]\s/.test(line.trim()))
    const listItems = items
      .map((item) => {
        const text = item.replace(/^[-*•]\s+/, "")
        return `<li class="text-muted-foreground leading-relaxed">${formatInline(text)}</li>`
      })
      .join("")
    return `<ul class="list-disc list-outside ml-6 my-6 space-y-2">${listItems}</ul>`
  }

  function parseOrderedList(block: string): string {
    const items = block.split("\n").filter((line) => /^\d+\.\s/.test(line.trim()))
    const listItems = items
      .map((item) => {
        const text = item.replace(/^\d+\.\s+/, "")
        return `<li class="text-muted-foreground leading-relaxed">${formatInline(text)}</li>`
      })
      .join("")
    return `<ol class="list-decimal list-outside ml-6 my-6 space-y-2">${listItems}</ol>`
  }

  function parseParagraph(block: string): string {
    // Обрабатываем переносы строк внутри параграфа
    const lines = block.split("\n")
    const formattedLines = lines.map((line) => formatInline(line.trim())).filter(Boolean)

    // Если строки разделены одиночным переносом, объединяем с <br>
    const content = formattedLines.join("<br />")

    if (!content) return ""
    return `<p class="text-muted-foreground leading-relaxed mb-6">${content}</p>`
  }

  function formatInline(text: string): string {
    if (!text) return ""

    let result = text

    // Защита HTML-символов
    result = result.replace(/&(?!amp;|lt;|gt;|nbsp;|mdash;|ndash;|quot;)/g, "&amp;")

    // Изображения (до ссылок)
    result = result.replace(
      /!\[([^\]]*)\]$$([^)]+)$$/g,
      '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full inline-block" />',
    )

    // Ссылки
    result = result.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-accent hover:underline font-medium">$1</a>',
    )

    // Жирный + курсив
    result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="font-bold text-foreground"><em>$1</em></strong>')
    result = result.replace(/___([^_]+)___/g, '<strong class="font-bold text-foreground"><em>$1</em></strong>')

    // Жирный текст
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    result = result.replace(/__([^_]+)__/g, '<strong class="font-bold text-foreground">$1</strong>')

    // Курсив
    result = result.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    result = result.replace(/_([^_]+)_/g, '<em class="italic">$1</em>')

    // Инлайн-код
    result = result.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-accent">$1</code>',
    )

    return result
  }

  const renderedContent = parseMarkdown(article.content)

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Все статьи
        </Link>

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

        <div className="relative aspect-video overflow-hidden rounded-xl mb-10">
          <img src={article.image || "/placeholder.svg"} alt={article.title} className="h-full w-full object-cover" />
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

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
