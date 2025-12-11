import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import Link from "next/link"

// === ТИПЫ ДЛЯ NEXT.JS ===
type Props = {
  params: Promise<{ slug: string }>
}

// === ГЕНЕРАЦИЯ СТАТИЧЕСКИХ ПУТЕЙ ===
export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

// === МЕТАДАННЫЕ ===
export async function generateMetadata({ params }: Props) {
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

// === ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ ===
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Форматирование даты
  let formattedDate = ""
  try {
    formattedDate = new Date(article.date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    formattedDate = article.date
  }

  // ==========================================
  // ⚙️ СОВЕРШЕННЫЙ ПАРСЕР MARKDOWN (V3.0)
  // ==========================================

  function formatRichText(text: string): string {
    if (!text) return ""
    let html = text

    // 1. Защита спецсимволов HTML
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

    // 2. Изображения: ![Alt](URL)
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      `<figure class="my-8">
        <img src="$2" alt="$1" class="rounded-xl w-full object-cover shadow-lg border border-border/50" loading="lazy" />
        ${"$1" ? `<figcaption class="text-center text-sm text-muted-foreground mt-2 italic">$1</figcaption>` : ""}
       </figure>`
    )

    // 3. Ссылки: [Text](URL)
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors decoration-2 underline-offset-2">$1</a>'
    )

    // 4. Инлайн Код: `code`
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted/80 px-1.5 py-0.5 rounded text-[0.9em] font-mono text-foreground border border-border">$1</code>'
    )

    // 5. Жирный текст: **text** или __text__ (В первую очередь!)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-foreground">$1</strong>')

    // 6. Курсив: *text* или _text_ (Во вторую очередь!)
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>')

    // 7. Типографика (стрелочки и тире)
    html = html.replace(/->/g, "→").replace(/<-/g, "←").replace(/---/g, "—")

    return html
  }

  // --- Парсер Таблиц ---
  function parseTable(block: string): string | null {
    const lines = block.split("\n").filter((l) => l.trim())
    if (lines.length < 2) return null

    const separator = lines[1]
    if (!separator.includes("-") || !separator.includes("|")) return null

    // Парсинг заголовков
    const headerCells = lines[0].split("|").filter((c) => c.trim())
    if (lines[0].trim().startsWith("|")) headerCells.shift()
    if (lines[0].trim().endsWith("|")) headerCells.pop()

    const headerHtml = headerCells
      .map((h) => `<th class="px-4 py-3 text-left font-bold text-foreground bg-muted/50 border border-border">${formatRichText(h.trim())}</th>`)
      .join("")

    // Парсинг тела таблицы
    const bodyRows = lines
      .slice(2)
      .map((row) => {
        const cells = row.split("|")
        if (row.trim().startsWith("|")) cells.shift()
        if (row.trim().endsWith("|")) cells.pop()

        const cellsHtml = cells
          .map((c) => `<td class="px-4 py-3 text-muted-foreground border border-border bg-background">${formatRichText(c.trim())}</td>`)
          .join("")
        return `<tr class="hover:bg-muted/10 transition-colors">${cellsHtml}</tr>`
      })
      .join("")

    return `<div class="my-8 w-full overflow-x-auto rounded-lg border border-border shadow-sm">
      <table class="w-full text-sm border-collapse">${headerHtml ? `<thead><tr class="border-b border-border">${headerHtml}</tr></thead>` : ""}<tbody>${bodyRows}</tbody></table>
    </div>`
  }

  // --- Парсер Списков (Маркированные) ---
  function parseUnorderedList(block: string): string {
    // Надежно ищем все строки, которые начинаются с маркера * или -
    const items = block.split('\n').filter(l => l.trim() && /^([-*])\s/.test(l.trim()));
    const listHtml = items.map(item => {
       // Надежно убираем маркер, учитывая пробелы в начале (Fix for visible asterisks)
       const content = item.trim().replace(/^([-*])\s+/, "")
       return `<li class="pl-2">${formatRichText(content)}</li>`
    }).join("")
    return `<ul class="my-6 ml-6 list-disc space-y-2 text-muted-foreground marker:text-primary">${listHtml}</ul>`
  }

  // --- Парсер Списков (Нумерованные) ---
  function parseOrderedList(block: string): string {
    // Надежно ищем все строки, которые начинаются с числа и точки
    const items = block.split('\n').filter(l => l.trim() && /^\d+\.\s/.test(l.trim()));
    const listHtml = items.map(item => {
       // Надежно убираем маркер, учитывая пробелы в начале
       const content = item.trim().replace(/^\d+\.\s+/, "")
       return `<li class="pl-2">${formatRichText(content)}</li>`
    }).join("")
    return `<ol class="my-6 ml-6 list-decimal space-y-2 text-muted-foreground marker:font-bold marker:text-foreground">${listHtml}</ol>`
  }

  // --- Парсер Заголовков, Цитат и Параграфов (без изменений) ---

  function parseHeading(block: string): string {
    const match = block.match(/^(#{1,6})\s+(.+)$/)
    if (!match) return '' // Должен быть обработан как параграф
    const level = match[1].length
    const text = formatRichText(match[2])
    const styles: Record<number, string> = {
        1: "text-4xl font-extrabold mt-12 mb-6 tracking-tight text-foreground",
        2: "text-3xl font-bold mt-10 mb-5 tracking-tight text-foreground",
        3: "text-2xl font-bold mt-8 mb-4 text-foreground",
        4: "text-xl font-semibold mt-6 mb-3 text-foreground",
        5: "text-lg font-semibold mt-6 mb-2 text-foreground",
        6: "text-base font-semibold mt-4 mb-2 text-foreground",
    }
    return `<h${level} class="${styles[level] || styles[6]}">${text}</h${level}>`
  }

  function parseBlockquote(block: string): string {
    const lines = block.split("\n").map(l => l.replace(/^>\s?/, "").trim()).filter(Boolean)
    const content = lines.map((line) => formatRichText(line)).join("<br />")
    return `
      <blockquote class="my-8 border-l-4 border-primary pl-6 py-1 italic text-muted-foreground bg-muted/20 rounded-r-lg">
        ${content}
      </blockquote>
    `
  }
  
  // --- Основной цикл Парсинга ---
  function parseMarkdown(content: string): string {
    if (!content) return ""

    // 1. Нормализация
    const text = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    
    // 2. Разбивка на блоки по двум и более переводам строк (стандарт Markdown)
    const blocks = text.split(/\n{2,}/)
    const result: string[] = []

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i].trim()
      if (!block) continue

      // 3. Таблицы
      if (
        block.includes("|") &&
        block.includes("\n") &&
        (block.trim().startsWith("|") || block.split("\n")[1]?.trim().startsWith("|"))
      ) {
        const tableHtml = parseTable(block)
        if (tableHtml) {
          result.push(tableHtml)
          continue
        }
      }

      // 4. Горизонтальная линия
      if (/^(\*{3,}|-{3,}|_{3,})$/.test(block)) {
        result.push('<hr class="my-10 border-t border-border" />')
        continue
      }

      // 5. Заголовки
      if (block.startsWith("#")) {
        result.push(parseHeading(block))
        continue
      }

      // 6. Цитаты
      if (block.startsWith(">")) {
        result.push(parseBlockquote(block))
        continue
      }
      
      // 7. Списки (Общая логика сбора и парсинга - ФИКСИТ БАГ 1., 1., 1.)
      if (/^([-*]|\d+\.)\s/.test(block)) { 
          let fullListBlock = block
          let j = i + 1
          
          // Агрессивно собираем все следующие блоки, которые начинаются как элемент списка
          while (j < blocks.length && blocks[j].trim() && /^([-*]|\d+\.)\s/.test(blocks[j].trim())) {
              fullListBlock += "\n\n" + blocks[j].trim()
              j++
          }
          
          // Перескакиваем на последний собранный элемент + 1
          i = j - 1

          // Определяем тип списка по первому элементу
          const isOrdered = /^\d+\.\s/.test(fullListBlock.split('\n')[0].trim())

          if (isOrdered) {
              result.push(parseOrderedList(fullListBlock))
          } else {
              result.push(parseUnorderedList(fullListBlock))
          }
          continue 
      }


      // 8. Обычный параграф (fallback)
      // Объединяем строки параграфа, разделенные одиночными переносами, в один абзац
      const pContent = block.split("\n").map(line => formatRichText(line)).join(" ")
      result.push(`<p class="mb-6 text-lg leading-8 text-muted-foreground">${pContent}</p>`)
    }

    return result.join("\n")
  }

  // ==========================================
  // 🎨 РЕНДЕР
  // ==========================================
  
  const renderedContent = parseMarkdown(article.content || "")

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        {/* Кнопка назад */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Назад ко всем статьям
        </Link>

        {/* Заголовок статьи */}
        <header className="mb-10 pb-8 border-b border-border">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1 text-sm border-none">
            {article.category}
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.15]">
            {article.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-light">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <time dateTime={article.date}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </header>

        {/* Главное изображение */}
        {article.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 shadow-xl border border-border bg-muted">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* --- КОНТЕНТ СТАТЬИ --- */}
        <div 
          className="article-body"
          dangerouslySetInnerHTML={{ __html: renderedContent }} 
        />

        {/* Футер статьи */}
        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
          <div className="text-sm text-muted-foreground italic">
            Автор: FinTech Guide Editorial
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            Читать другие статьи
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </article>
    </main>
  )
}
