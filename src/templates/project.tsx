import * as React from "react"
import { Link, type HeadFC, type PageProps } from "gatsby"
import "../styles/portfolio.css"
import { projects } from "../data/projects"
import ArchDiagram from "../components/ArchDiagram"

type Ctx = { slug: string }
const find = (slug: string) => projects.find(p => p.slug === slug)!

const ProjectPage: React.FC<PageProps<object, Ctx>> = ({ pageContext }) => {
  const p = find(pageContext.slug)
  const sections = p.sections.filter(s => s.points?.length || s.planned?.length || s.code?.length || s.images?.length)
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <Link to="/" className="brand">SMS<span>.</span></Link>
          <div className="nav-links">
            <Link to="/#projects">← All projects</Link>
          </div>
        </div>
      </nav>

      <header className="hero proj-hero">
        <div className="wrap">
          <span className="eyebrow">Project</span>
          <h1>{p.name}</h1>
          <p className="hero-sum">{p.desc}</p>
          <div className="proj-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
          <div className="arch-frame"><ArchDiagram arch={p.arch} /></div>
        </div>
      </header>

      <main>
        {sections.map(s => (
          <section key={s.title} className="proj-section">
            <div className="wrap">
              <div className="section-head"><h2>{s.title}</h2></div>
              {s.points && <ul className="proj-list">{s.points.map((t, i) => <li key={i}>{t}</li>)}</ul>}
              {s.planned && (
                <ul className="proj-list">
                  {s.planned.map((t, i) => <li key={i}><span className="badge">Planned</span>{t}</li>)}
                </ul>
              )}
              {s.code?.map(c => (
                <figure key={c.caption}>
                  <pre className="code"><code>{c.src}</code></pre>
                  <figcaption>{c.caption} · {c.lang}</figcaption>
                </figure>
              ))}
              {s.images?.map(im => (
                <figure key={im.src}>
                  <img src={im.src} alt={im.caption} />
                  <figcaption>{im.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <div className="wrap">© {new Date().getFullYear()} Syed Mohsin Shah · Saskatoon, SK</div>
      </footer>
    </>
  )
}

export default ProjectPage

export const Head: HeadFC<object, Ctx> = ({ pageContext }) => {
  const p = find(pageContext.slug)
  return (
    <>
      <html lang="en" />
      <title>{p.name} · Syed Mohsin Shah</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="description" content={p.desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  )
}
