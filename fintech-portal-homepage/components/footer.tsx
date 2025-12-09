import { Twitter, Youtube, Linkedin, Send } from "lucide-react"

const footerLinks = {
  product: {
    title: "Продукт",
    links: [
      { label: "Обзоры", href: "#reviews" },
      { label: "Сравнение", href: "#compare" },
      { label: "Калькуляторы", href: "#calculators" },
      { label: "API", href: "#api" },
    ],
  },
  resources: {
    title: "Ресурсы",
    links: [
      { label: "Блог", href: "#blog" },
      { label: "Гайды", href: "#guides" },
      { label: "Глоссарий", href: "#glossary" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  company: {
    title: "Компания",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Контакты", href: "#contacts" },
      { label: "Карьера", href: "#careers" },
      { label: "Партнерам", href: "#partners" },
    ],
  },
  legal: {
    title: "Правовая информация",
    links: [
      { label: "Политика конфиденциальности", href: "#privacy" },
      { label: "Условия использования", href: "#terms" },
      { label: "Cookie", href: "#cookies" },
    ],
  },
}

const socialLinks = [
  { icon: Send, href: "#", label: "Telegram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
              <a href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                  <span className="text-lg font-bold text-accent-foreground">F</span>
                </div>
                <span className="text-xl font-bold text-background">
                  FinTech<span className="text-accent">Guide</span>
                </span>
              </a>
              <p className="text-sm text-background/70 leading-relaxed max-w-xs">
                Образовательный портал о современных финансах. Помогаем разобраться в мире цифровых денег.
              </p>

              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-background mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-background/70 transition-colors hover:text-accent">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">© {new Date().getFullYear()} FinTechGuide. Все права защищены.</p>
            <p className="text-sm text-background/60">Сделано с ❤️ для финансовой грамотности</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
