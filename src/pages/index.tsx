import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import "../styles/portfolio.css"

const EMAIL = "mohsinshah3171@gmail.com"
const PHONE = "+1 306 380 5477"
const LINKEDIN = "https://linkedin.com/in/syed-mohsin-shah/"

const skills = [
  { title: "Languages", items: ["SystemVerilog", "Verilog", "VHDL", "C/C++", "Python", "Tcl", "Bash", "MATLAB"] },
  { title: "EDA Tools", items: ["Synopsys VCS", "Design Compiler", "QuestaSim", "Cadence Virtuoso", "Xilinx Vivado", "Intel Quartus"] },
  { title: "DV Concepts", items: ["UVM", "Self-Checking Testbenches", "CDC", "STA", "Timing Closure", "Functional Coverage"] },
  { title: "Architecture", items: ["AXI / SPI / I2C", "DMA", "NoC", "FSM Control", "Fault Tolerance", "DFT / BIST"] },
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
      "Evaluated spatial, depth-wise, and capacity-based tiling strategies for PE-array mapping, balancing compute utilization against on-chip memory and DSP constraints.",
    ],
  },
  {
    role: "Research Collaboration — Edge AI Transportation (WIM)",
    org: "Quarterhill",
    date: "2026",
    points: [
      "Developing an embedded edge-AI FPGA platform for Weigh-In-Motion calibration, fusing computer vision and axle-sensor streams for real-time vehicle weight estimation.",
      "Building automated multimodal data-acquisition and validation pipelines across 10,000+ test passages, profiling latency and accuracy pre-deployment.",
    ],
  },
  {
    role: "Research Assistant",
    org: "System-on-Chip Lab, NUST",
    date: "Mar 2024 – Aug 2024",
    points: [
      "Researched fault-tolerant system architectures for deep neural networks, targeting resilience under hardware-induced errors.",
      "Implemented TinyML inference pipelines for edge deployment, optimizing for latency under constrained resources.",
      "Programmed FPGAs in Verilog for hardware customization, tuning performance and efficiency.",
    ],
  },
  {
    role: "FPGA Intern",
    org: "DreamBig Semiconductors",
    date: "Jan 2024 – Mar 2024",
    points: [
      "Shadowed the FPGA/ASIC design team on-site to study industry RTL flows, verification methodology, and chip design practices outside coursework.",
    ],
  },
  {
    role: "Research Assistant",
    org: "Secured IoT Devices Lab, Peshawar",
    date: "Oct 2022 – Jul 2023",
    points: [
      "Developed a LoRaWAN-based monitoring system with cloud integration, implementing embedded C firmware for sensor data acquisition on ESP32 nodes over SPI/I2C.",
      "Built a Raspberry Pi–based gateway and secured the communication stack with cybersecurity protocols for a final-year IoT research project.",
    ],
  },
]

const projects = [
  {
    name: "Winograd CNN Accelerator",
    desc: "RTL accelerator on ZCU102 hitting 5.3 TOPS on VGG16 via streamed dataflow optimization and simulation-based functional verification. Extended into an overlap-aware streaming architecture, ready for journal submission.",
    tags: ["RTL", "FPGA", "ZCU102"],
  },
  {
    name: "Power-Efficient POSIT Multiplier",
    desc: "Timing-aware Verilog RTL for decode, multiply, and recode pipeline stages; synthesized in Synopsys Design Compiler, validating 4–7% power reduction via switching-activity analysis.",
    tags: ["Arithmetic", "Low Power"],
  },
  {
    name: "Depthwise Separable CNN Accelerator",
    desc: "Parallel RTL architecture for MobileNet-class models achieving ~20× speedup through dataflow parallelism.",
    tags: ["RTL", "Parallelism"],
  },
  {
    name: "DFT for Systolic Arrays",
    desc: "Scan chains and BIST for systolic PE arrays, improving fault coverage and enabling structured post-silicon validation.",
    tags: ["DFT", "BIST", "Verification"],
  },
  {
    name: "Fault Tolerance Enhancement for DNNs",
    desc: "Investigated fault-tolerant architectures for deep neural network accelerators under hardware-induced error models.",
    tags: ["Reliability", "DNN Hardware"],
  },
  {
    name: "Dynamic 32×64 LED Matrix Display",
    desc: "Xilinx FPGA design driving a high-resolution LED matrix at 30 fps, with UART-based visual data ingestion and clock/data synchronization.",
    tags: ["RTL", "FPGA", "UART"],
  },
]

const softSkills = [
  { title: "Leadership & Mentorship", desc: "Led a project team and mentored peers (7-member team, K2X); mentored students as a Teaching Assistant." },
  { title: "Communication & Presentation", desc: "Presented extensively in graduate courses; liaised with international clients and stakeholders." },
  { title: "Teaching & Community", desc: "TA for Probability & Statistics (UofS, 2026) and high-school math; Microsoft Learn Student Ambassador; IEEE Student Member." },
  { title: "Volunteering", desc: "Student Wellness Center, UofS — event logistics; Media Team, University Computer Society." },
  { title: "Customer Service", desc: "POS operations, cash handling, and client-facing service, APS Stationary." },
  { title: "Cross-Functional Collaboration", desc: "3+ years of general software engineering experience (K2X, Dcube, Auxcube, The Solutioners) coordinating with product, client, and research teams." },
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
            <a href="#beyond">Beyond</a>
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
          <div className="avatar-wrap">
            <img className="avatar" src="/images/me.png" alt="Syed Mohsin Shah" />
            {/* Swap inner div for <div className="avatar">[ ADD PHOTO ]<br />src/images</div> */}
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
              I focus on designing microarchitectures, integrating subsystems, ensuring timing
              closure, and verifying AI accelerators. My work spans accross performance-optimized
              designs, precision-aware arithmetic, and verification methodologies.
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

        <section id="beyond">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="k">Beyond the Bench</div>
              <h2>Soft Skills</h2>
            </div>
            <div className="skills-grid reveal">
              {softSkills.map(s => (
                <div className="skill-card" key={s.title}>
                  <h3>{s.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{s.desc}</p>
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
    <title>Syed Mohsin Shah</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta
      name="description"
      content="Syed Mohsin Shah — M.Sc. Electrical Engineering candidate specializing in RTL and FPGA design for AI accelerators."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
)
