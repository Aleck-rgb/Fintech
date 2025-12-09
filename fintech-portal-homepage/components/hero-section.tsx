import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 py-20 sm:py-28 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent-foreground backdrop-blur-sm border border-accent/30">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-primary-foreground/90">Образовательный портал о финтехе</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Ваш гид в мире <span className="text-accent">цифровых денег</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
            Находите надежные финтех-сервисы, экономьте на переводах и повышайте свою финансовую грамотность вместе с
            нами
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all text-base px-8 py-6"
            >
              Читать обзоры
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="h-5 w-5" />
                <span className="text-3xl font-bold text-primary-foreground sm:text-4xl">50+</span>
              </div>
              <span className="mt-2 text-sm text-primary-foreground/70">Обзоров сервисов</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-accent">
                <Shield className="h-5 w-5" />
                <span className="text-3xl font-bold text-primary-foreground sm:text-4xl">100K+</span>
              </div>
              <span className="mt-2 text-sm text-primary-foreground/70">Читателей в месяц</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
              <div className="flex items-center gap-2 text-accent">
                <Zap className="h-5 w-5" />
                <span className="text-3xl font-bold text-primary-foreground sm:text-4xl">15%</span>
              </div>
              <span className="mt-2 text-sm text-primary-foreground/70">Экономии на переводах</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
