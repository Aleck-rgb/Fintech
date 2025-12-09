import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock } from "lucide-react"
import { getLatestArticles } from "@/lib/articles"

const fallbackArticles = [
  {
    slug: "best-mobile-banks-2024",
    image: "/digital-banking-app-interface.jpg",
    category: "Обзоры",
    title: "Лучшие мобильные банки 2024: сравнительный обзор",
    description: "Сравниваем функциональность, комиссии и удобство использования топ-10 цифровых банков России",
    readTime: "8 мин",
    content: "",
    date: "2024-12-01",
  },
  {
    slug: "international-transfers-guide",
    image: "/international-money-transfer-globe.jpg",
    category: "Переводы",
    title: "Как отправить деньги за границу без потерь на курсе",
    description: "Подробный гид по выбору сервиса для международных переводов с минимальными комиссиями",
    readTime: "6 мин",
    content: "",
    date: "2024-11-28",
  },
  {
    slug: "investing-beginners-2024",
    image: "/investment-chart-growth-stocks.jpg",
    category: "Обучение",
    title: "Инвестиции для начинающих: с чего начать в 2024",
    description: "Пошаговое руководство для тех, кто хочет начать инвестировать, но не знает с чего начать",
    readTime: "12 мин",
    content: "",
    date: "2024-11-25",
  },
]

export function LatestArticles() {
  let articles = getLatestArticles(3)
  if (articles.length === 0) {
    articles = fallbackArticles
  }

  return (
    <section className="py-20 sm:py-24 bg-secondary/30" id="articles">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Последние статьи
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Актуальные материалы и аналитика</p>
          </div>
          <a
            href="/articles"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Все статьи
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {articles.map((article) => (
            <Card
              key={article.slug}
              className="group overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
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
                  <a href={`/articles/${article.slug}`}>{article.title}</a>
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
                  <a
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Читать
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
