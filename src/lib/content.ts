import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'

const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
  date: z.string().optional(),
  repo: z.string().optional(),
  live: z.string().url().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
})

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>

const contentRoot = path.join(process.cwd(), 'content')

export function getProjectSlugs() {
  const dir = path.join(contentRoot, 'projects')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getProjectBySlug(slug: string) {
  const filePath = path.join(contentRoot, 'projects', `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = matter(raw)

  const fm = ProjectFrontmatterSchema.parse(parsed.data)

  return {
    slug,
    frontmatter: fm,
    content: parsed.content,
  }
}

export function getAllProjects() {
  return getProjectSlugs()
    .map((slug) => getProjectBySlug(slug))
    .sort((a, b) => {
      const ad = a.frontmatter.date ? Date.parse(a.frontmatter.date) : 0
      const bd = b.frontmatter.date ? Date.parse(b.frontmatter.date) : 0
      return bd - ad
    })
}
