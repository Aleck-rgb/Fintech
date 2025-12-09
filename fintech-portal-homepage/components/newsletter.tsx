"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, Loader2 } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("success")
    setEmail("")
  }

  return (
    <section className="py-20 sm:py-24 bg-primary" id="newsletter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
            <Mail className="h-7 w-7 text-accent" />
          </div>

          {/* Heading */}
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Будьте в курсе новостей финтеха
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 leading-relaxed">
            Подпишитесь на рассылку и получайте лучшие материалы, обзоры и аналитику прямо на почту
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 text-accent py-4 rounded-lg bg-accent/10">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Спасибо за подписку!</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent focus:ring-accent"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Подписка...
                    </>
                  ) : (
                    "Подписаться"
                  )}
                </Button>
              </div>
            )}
          </form>

          {/* Privacy Note */}
          <p className="mt-4 text-sm text-primary-foreground/60">
            Мы уважаем вашу приватность. Отписаться можно в любой момент.
          </p>
        </div>
      </div>
    </section>
  )
}
