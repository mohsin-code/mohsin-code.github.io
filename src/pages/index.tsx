import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import "../styles/portfolio.css"

const EMAIL = "mohsinshah3171@gmail.com"
const PHONE = "+1 306 380 5477"
const LINKEDIN = "https://linkedin.com/in/syed-mohsin-shah/"

const skills = [
  { title: "Languages", items: ["SystemVerilog", "Verilog", "C/C++", "Python", "Tcl", "Bash"] },
  { title: "EDA Tools", items: ["Synopsys VCS", "Design Compiler", "QuestaSim", "Cadence Virtuoso", "Xilinx Vivado", "Intel Quartus"] },
  { title: "Concepts", items: ["CDC", "AXI / SPI / I2C", "STA", "UVM", "DMA", "Timing Closure"] },
  { title: "Workflow", items: ["Git", "Linux", "Docker", "Makefile"] },
]

const experience = [
  {
    role: "Research Assistant",
    org: "University of Saskatchewan — Ko Lab",
    date: "Sep 2024 – Present",
    points: [
      "Architected a 55-module FPGA SoC accelerator (Winograd PE array, hierarchical NoC, DMA engine, multi-bank memory, control FSMs) with end-to-end RTL design and subsystem integration.",
      "Designed distributed SystemVerilog RTL and FSM control for compute scheduling and memory sequencing, integrating vendor DDR4 EMIF and BRAM IP over AXI.",
      "Achieved 250 MHz timing closure on Intel Arria-10 via synthesis, STA, pipelining, retiming, and register balancing.",
      "Reduced ASIC power 4–7% with variable-precision arithmetic units minimizing switching activity under Design Compiler.",
      "Built self-checking testbenches with golden-reference models and Python/Tcl regression across 15+ configs, cutting debug turnaround 60%.",
    ],
  },
  {
    role: "Research Collaboration — Edge AI Transportation",
    org: "Quarterhill",
    date: "May 2026",
    points: [
      "Developing an embedded edge-AI FPGA platform with multimodal sensor fusion and computer vision, optimizing real-time inference under tight compute/memory constraints.",
      "Building automated data-acquisition and validation pipelines syncing sensor streams across 10,000+ test passages, profiling latency and accuracy pre-deployment.",
    ],
  },
  {
    role: "Software Engineer",
    org: "K2x Tech",
    date: "2023 – 2024",
    points: [
      "Built production backend features and integrated AI capabilities for international clients in a 6-member team.",
      "Improved application performance 10% via query optimization, indexing, and profiling of production workloads.",
      "Diagnosed production issues through root-cause analysis, delivering reliable releases across cross-functional teams.",
    ],
  },
  {
    role: "Research Assistant",
    org: "Secured IoT Devices Lab, Pakistan",
    date: "2023",
    points: [
      "Developed low-level embedded C firmware for ESP32 sensor nodes over SPI and I2C for real-time acquisition from analog and digital peripherals.",
    ],
  },
]

const projects = [
  {
    name: "Winograd CNN Accelerator",
    desc: "RTL accelerator on ZCU102 hitting 5.3 TOPS on VGG16 via dataflow optimization and simulation-based functional verification.",
    tags: ["RTL", "FPGA", "ZCU102"],
  },
  {
    name: "POSIT Multiplier",
    desc: "Variable-precision arithmetic RTL validating 4–7% power reduction through switching-activity analysis at synthesis.",
    tags: ["Arithmetic", "Low Power"],
  },
  {
    name: "Depthwise CNN Accelerator",
    desc: "Parallel RTL architecture achieving 20× speedup through dataflow parallelism.",
    tags: ["RTL", "Parallelism"],
  },
  {
    name: "DFT for Systolic Arrays",
    desc: "Scan chains and BIST for systolic PE arrays enabling structured post-silicon validation.",
    tags: ["DFT", "BIST", "Verification"],
  },
]

const education = [
  {
    degree: "M.Sc. Electrical Engineering",
    org: "University of Saskatchewan",
    meta: "July 2026 · Deep Learning Architectures, Computer Architecture, EDA Simulation",
  },
  {
    degree: "B.Sc. Computer Systems Engineering",
    org: "University of Engineering & Technology, Peshawar",
    meta: "2023",
  },
]

const ROLES = [
  "RTL & FPGA Design Engineer",
  "AI Accelerator Architect",
  "SystemVerilog / UVM Verification",
  "M.Sc. Electrical Engineering",
]

function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal")
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useCursorGlow() {
  React.useEffect(() => {
    const glow = document.querySelector<HTMLElement>(".cursor-glow")
    if (!glow) return
    const move = (e: MouseEvent) => {
      glow.style.left = e.clientX + "px"
      glow.style.top = e.clientY + "px"
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])
}

// typewriter cycling through ROLES
function useTypewriter() {
  const [text, setText] = React.useState("")
  React.useEffect(() => {
    let role = 0, char = 0, deleting = false, timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const full = ROLES[role]
      char += deleting ? -1 : 1
      setText(full.slice(0, char))
      let delay = deleting ? 40 : 90
      if (!deleting && char === full.length) { delay = 1600; deleting = true }
      else if (deleting && char === 0) { deleting = false; role = (role + 1) % ROLES.length; delay = 400 }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [])
  return text
}

const IndexPage: React.FC<PageProps> = () => {
  useReveal()
  useCursorGlow()
  const role = useTypewriter()
  return (
    <>
      <div className="cursor-glow" />
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            SMS<span>.</span>
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">RTL &amp; FPGA Design · AI Accelerators</span>
            <h1 className="glitch" data-text="Syed Mohsin Shah">
              Syed <span>Mohsin&nbsp;Shah</span>
            </h1>
            <p className="hero-role">
              {role}
              <span className="cursor">&nbsp;</span>
            </p>
            <p className="hero-sum">
              Graduate researcher building AI accelerators for ASIC and FPGA platforms. I design
              system-level RTL architectures and reusable digital hardware blocks, and build
              automated verification environments to validate design behavior.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>Get in touch</a>
              <a className="btn btn-ghost" href="#projects">View projects</a>
            </div>
          </div>
          {/* Swap inner div for <img className="avatar" src="/me.jpg" alt="Syed Mohsin Shah" /> */}
          <div className="avatar-wrap">
            <div className="avatar">[ ADD PHOTO ]<br />src/images</div>
          </div>
        </div>
      </header>

      <main>
        <section id="about">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="k">About</div>
              <h2>What I work on</h2>
            </div>
            <p className="hero-sum" style={{ maxWidth: 760 }}>
              I focus on the full RTL flow — microarchitecture, subsystem integration, timing
              closure, and verification — for AI-acceleration hardware. My work spans Winograd and
              depthwise CNN accelerators, variable-precision arithmetic for power reduction, and
              design-for-test on systolic arrays, from SystemVerilog RTL down to synthesis and STA.
            </p>
          </div>
        </section>

        <section id="skills">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="k">Toolbox</div>
              <h2>Skills</h2>
            </div>
            <div className="skills-grid reveal">
              {skills.map(g => (
                <div className="skill-card" key={g.title}>
                  <h3>{g.title}</h3>
                  <div className="chips">
                    {g.items.map(i => <span className="chip" key={i}>{i}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="k">Journey</div>
              <h2>Experience</h2>
            </div>
            <div className="timeline">
              {experience.map(e => (
                <div className="tl-item reveal" key={e.role + e.org}>
                  <div className="tl-top">
                    <div>
                      <div className="tl-role">{e.role}</div>
                      <div className="tl-org">{e.org}</div>
                    </div>
                    <div className="tl-date">{e.date}</div>
                  </div>
                  <ul>
                    {e.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="k">Selected Work</div>
              <h2>Projects</h2>
            </div>
            <div className="proj-grid reveal">
              {projects.map(p => (
                <div className="proj-card" key={p.name}>
                  {/* Swap for <img src="..." alt={p.name} /> */}
                  <div className="proj-thumb">Add image</div>
                  <div className="proj-body">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="proj-tags">
                      {p.tags.map(t => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="education">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="k">Background</div>
              <h2>Education</h2>
            </div>
            <div className="edu-grid reveal">
              {education.map(e => (
                <div className="edu-card" key={e.degree}>
                  <h3>{e.degree}</h3>
                  <div className="org">{e.org}</div>
                  <div className="meta">{e.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="wrap reveal">
            <div className="k" style={{ color: "var(--pink)" }}>Contact</div>
            <h2>Let's build <span>something.</span></h2>
            <p>
              Open to RTL / FPGA / verification roles and research collaborations. Reach out — I
              reply fast.
            </p>
            <div className="contact-links">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="btn btn-ghost" href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">© {new Date().getFullYear()} Syed Mohsin Shah · Saskatoon, SK</div>
      </footer>
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <>
    <html lang="en" />
    <title>Syed Mohsin Shah — RTL & FPGA Design</title>
    <meta
      name="description"
      content="Syed Mohsin Shah — M.Sc. Electrical Engineering candidate specializing in RTL and FPGA design for AI accelerators."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
)
