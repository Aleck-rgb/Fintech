import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, ArrowLeft } from "lucide-react"
import { getAllArticles } from "@/lib/articles"
import Link from "next/link"

export const metadata = {
  title: "Все статьи | FinTechGuide",
  description: "Обзоры финансовых сервисов, гиды по переводам и обучающие материалы",
}

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">Все статьи</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Обзоры финансовых сервисов, подробные гиды по международным переводам и обучающие материалы для начинающих
            инвесторов
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {articles.map((article) => (
              <Card
                key={article.slug}
                className="group overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground hover:bg-accent/90">
                    {article.category}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-accent transition-colors">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-4">
                    {article.description}
                  </CardDescription>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      Читать
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Статьи пока не добавлены</p>
          </div>
        )}
      </div>
    </main>
  )
}
