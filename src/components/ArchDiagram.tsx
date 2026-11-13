import * as React from "react"
import type { Project } from "../data/projects"

const W = 120, H = 50

// Animated block diagram: boxes + edges, with packets riding the datapath edges (SVG animateMotion).
const ArchDiagram: React.FC<{ arch: Project["arch"] }> = ({ arch }) => {
  const box = Object.fromEntries(arch.nodes.map(n => [n.id, { ...n, w: n.w ?? W, h: n.h ?? H }]))

  // connect box borders: side-to-side if mostly horizontal, else top/bottom
  const ends = (a: string, b: string) => {
    const p = box[a], q = box[b]
    const [pcx, pcy, qcx, qcy] = [p.x + p.w / 2, p.y + p.h / 2, q.x + q.w / 2, q.y + q.h / 2]
    if (Math.abs(qcx - pcx) > Math.abs(qcy - pcy)) {
      const r = qcx > pcx
      return [r ? p.x + p.w : p.x, pcy, r ? q.x : q.x + q.w, qcy]
    }
    const d = qcy > pcy
    return [pcx, d ? p.y + p.h : p.y, qcx, d ? q.y : q.y + q.h]
  }

  return (
    <svg className="arch" viewBox="0 0 800 400" role="img" aria-label="Architecture diagram">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>
      {arch.edges.map(([a, b, kind], i) => {
        const [x1, y1, x2, y2] = ends(a, b)
        const d = `M${x1} ${y1}L${x2} ${y2}`
        return (
          <g key={i} className={kind === "ctrl" ? "edge ctrl" : "edge"}>
            <path d={d} markerEnd="url(#arrow)" />
            {kind !== "ctrl" && (
              <circle className="packet" r="4">
                <animateMotion dur="1.6s" begin={`${i * 0.25}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        )
      })}
      {Object.values(box).map((n, i) => (
        <g key={n.id} className={n.accent ? "node accent" : "node"} style={{ animationDelay: `${i * 0.3}s` }}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="4" />
          <text x={n.x + n.w / 2} y={n.y + n.h / 2}>{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

export default ArchDiagram
