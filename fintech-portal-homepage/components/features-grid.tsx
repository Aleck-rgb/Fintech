import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowRightLeft, BookOpen, Globe } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Обзоры финтех-платформ",
    description: "Детальные обзоры банков, платежных систем и инвестиционных приложений с рейтингами и сравнениями",
  },
  {
    icon: ArrowRightLeft,
    title: "Гид по денежным переводам",
    description:
      "Сравнение комиссий, курсов и скорости международных переводов. Найдите лучший способ отправить деньги",
  },
  {
    icon: BookOpen,
    title: "Финансовая грамотность",
    description: "Обучающие материалы от основ бюджетирования до продвинутых инвестиционных стратегий",
  },
  {
    icon: Globe,
    title: "Аналитика рынка",
    description: "Еженедельные обзоры трендов финтех-индустрии, новости и экспертные прогнозы",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-20 sm:py-24 bg-background" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Основные направления
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Всё, что нужно для уверенного управления личными финансами в цифровую эпоху
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:border-accent/30"
            >
              <CardHeader className="pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
              {/* Hover Accent Line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
