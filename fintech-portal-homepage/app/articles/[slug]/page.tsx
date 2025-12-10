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

  function parseMarkdown(content: string): string {
    let html = content

    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    html = html.replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '<hr class="my-8 border-border" />')

    html = html.replace(/^###### (.+)$/gm, '<h6 class="text-base font-semibold text-foreground mt-6 mb-3">$1</h6>')
    html = html.replace(/^##### (.+)$/gm, '<h5 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h5>')
    html = html.replace(/^#### (.+)$/gm, '<h4 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h4>')
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold text-foreground mt-10 mb-4">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold text-foreground mt-10 mb-6">$1</h1>')

    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold text-foreground"><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-foreground">$1</strong>')
    html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>')

    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

    html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-accent hover:underline">$1</a>')

    html = html.replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full" />')

    html = html.replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">$1</blockquote>',
    )

    html = html.replace(/^[-*] (.+)$/gm, '<li class="text-muted-foreground ml-4">$1</li>')
    html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside my-4 space-y-2">$&</ul>')

    html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-muted-foreground ml-4">$1</li>')

    const lines = html.split("\n\n")
    html = lines
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return ""
        if (trimmed.startsWith("<")) return trimmed
        return `<p class="text-muted-foreground leading-relaxed mb-4">${trimmed.replace(/\n/g, "<br />")}</p>`
      })
      .join("\n")

    return html
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

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderedContent }} />

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
