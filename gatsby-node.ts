import path from "path"
import type { GatsbyNode } from "gatsby"
import { projects } from "./src/data/projects"

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const component = path.resolve("src/templates/project.tsx")
  projects.forEach(p => actions.createPage({ path: `/projects/${p.slug}/`, component, context: { slug: p.slug } }))
}
