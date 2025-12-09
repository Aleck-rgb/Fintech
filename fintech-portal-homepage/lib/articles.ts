import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface Article {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  image: string
  content: string
  date: string
}

const articlesDirectory = path.join(process.cwd(), "content/articles")

export function getAllArticles(): Article[] {
  // Проверяем существует ли папка
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const articles = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "")
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || "Без названия",
        description: data.description || "",
        category: data.category || "Статьи",
        readTime: data.readTime || "5 мин",
        image: data.image || "/open-book-knowledge.png",
        content,
        date: data.date || new Date().toISOString(),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export function getArticleBySlug(slug: string): Article | null {
  const mdPath = path.join(articlesDirectory, `${slug}.md`)
  const mdxPath = path.join(articlesDirectory, `${slug}.mdx`)

  let fullPath = ""
  if (fs.existsSync(mdPath)) {
    fullPath = mdPath
  } else if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath
  } else {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || "Без названия",
    description: data.description || "",
    category: data.category || "Статьи",
    readTime: data.readTime || "5 мин",
    image: data.image || "/open-book-knowledge.png",
    content,
    date: data.date || new Date().toISOString(),
  }
}

export function getLatestArticles(count = 3): Article[] {
  return getAllArticles().slice(0, count)
}
