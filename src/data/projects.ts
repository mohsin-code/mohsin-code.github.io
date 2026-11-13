// Single source for project cards (index) and /projects/<slug>/ pages (gatsby-node.ts).

export type ArchNode = { id: string; label: string; x: number; y: number; w?: number; h?: number; accent?: boolean }
// [from, to, kind] — "ctrl" draws a dashed control line, default is a datapath with moving packets
export type ArchEdge = [string, string, ("ctrl" | "data")?]

export type Section = {
  title: string
  points?: string[]
  planned?: string[] // rendered with a PLANNED badge, keep separate from completed work
  code?: { caption: string; lang: string; src: string }[]
  images?: { caption: string; src: string }[] // paths under /static, e.g. /images/winograd/wave.png
}

export type Project = {
  slug: string
  name: string
  desc: string
  tags: string[]
  arch: { nodes: ArchNode[]; edges: ArchEdge[] } // diagram viewBox is 800x400
  sections: Section[] // empty sections are not rendered
}

export const projects: Project[] = [
  {
    slug: "winograd-cnn-accelerator",
    name: "Winograd CNN Accelerator",
    desc: "Row-streamed F(4×4,3×3) Winograd CNN accelerator in SystemVerilog for Intel Arria-10 SX. Transform-domain overlap reuse and phase-offset multiplier pooling cut multipliers from 30 to 9 per cluster; 250 MHz, 539.8 GOPS on VGG-16, verified layer-by-layer against Python golden models.",
    tags: ["SystemVerilog", "Arria-10", "Winograd", "Verification"],
    arch: {
      nodes: [
        { id: "ddr", label: "DDR4 (Avalon-MM)", x: 10, y: 175, w: 120 },
        { id: "arb", label: "Read Arbiter", x: 155, y: 175, w: 110 },
        { id: "ctl", label: "Top Controller", x: 330, y: 20, w: 130 },
        { id: "iact", label: "Act. Buffer A/B", x: 290, y: 110, w: 130 },
        { id: "wgt", label: "Weight Buffer A/B", x: 290, y: 240, w: 130 },
        { id: "noc", label: "8×2 Cluster NoC ×Q", x: 455, y: 175, w: 155, accent: true },
        { id: "add", label: "Adder Tree", x: 655, y: 90, w: 130 },
        { id: "post", label: "ReLU / Pool", x: 655, y: 180, w: 130 },
        { id: "out", label: "Output Stage Buf", x: 655, y: 280, w: 130 },
        { id: "wr", label: "Write I/F", x: 155, y: 330, w: 110 },
      ],
      edges: [
        ["ddr", "arb"], ["arb", "iact"], ["arb", "wgt"], ["iact", "noc"], ["wgt", "noc"],
        ["noc", "add"], ["add", "post"], ["post", "out"], ["out", "wr"], ["wr", "ddr"],
        ["ctl", "arb", "ctrl"], ["ctl", "iact", "ctrl"], ["ctl", "noc", "ctrl"],
      ],
    },
    // Sources: winograd-cnn-accelerator repo (main = verification flow, feat/f4-perf = F(4,3) pooled build)
    // and the journal draft "Transform-Domain Overlap Reuse and Phase-Offset Multiplier Pooling ...".
    sections: [
      {
        title: "Architecture",
        points: [
          "39 SystemVerilog RTL sources: buffers, sequencers, NoC mappers, routers, cluster datapath, post-processing, Avalon-MM I/O and top-level control. No vendor IP; buffer RAMs are inferred M20K/MLAB.",
          "Single Avalon-MM master to the HPS DDR4 controller (512-bit data, 24-bit word address). Activation fetch, weight fetch and output drain are arbitrated onto one read port and one write port.",
          "Double-banked (ping-pong) activation and weight buffers. 34 activation banks hold a 32-row band plus a 2-row halo, so each row is fetched from DRAM once instead of once per tile.",
          "Q output-channel groups, each an 8×2 cluster NoC followed by an adder tree, ReLU/pooling and a shared output stage buffer. Weights enter at one corner and propagate; activations enter from the left, and each cluster inherits 2 of its 4 taps from its northern neighbour.",
          "Seven-stage cluster pipeline: input register, routing, four parallel transform lanes (Bᵀd), multiply, sum, output transform (Aᵀ), channel accumulation. FC layers take a bypass that skips the transforms.",
          "Transform-domain overlap reuse: transformed columns are kept across tile boundaries, so a sweep of width W evaluates W+2 column transforms instead of 6⌈W/4⌉.",
          "Phase-offset multiplier pooling: four clusters skewed one cycle apart have constant combined product demand (5+1+0+0), so six shared multipliers per transform row replace 30 per cluster with 9.",
          "F(2,3) and F(4,3) are an elaboration-time switch (WINO_CONFIG). Larger and strided kernels decompose into 3×3 sub-kernels, so F(m,3) is the only compute primitive.",
        ],
      },
      {
        title: "Verification Architecture",
        points: [
          "One self-checking SystemVerilog testbench per module (39 in total), from transforms and MACs up through the cluster, NoC, sequencers, buffers, arbiter and top level. Each bench prints PASS/FAIL with the first mismatches.",
          "Python/NumPy generators build stimulus and golden vectors. The golden direct convolution is cross-checked against 2-D Winograd, per-lane 1-D Winograd and a cycle-faithful MAC-row streaming model before any RTL comparison, so a wrong reference model fails before it can mask an RTL bug.",
          "Behavioural DDR model (fake_ddr) with configurable read latency, jitter, bus turnaround and refresh, standing in for the HPS DDR4 controller.",
          "Reusable SVA macro library (ASSERT_NO_X, ASSERT_IMPLY, ASSERT_NEXT) bound inside module benches to check X-propagation and handshake and mode invariants every cycle.",
          "Sequencer benches dump fetch traces, which Python scripts check and render as HTML fetch grids for review.",
          "Benches are parameterized over F(2,3) and F(4,3) (-gM=2|4); F(4,3) benches run at 32 bits so values compare exactly.",
          "Flow: directed SystemVerilog plus Python scoreboarding in Questa. No UVM environment yet.",
        ],
      },
      {
        title: "Verification Strategy",
        points: [
          "Directed tests per module against Python golden vectors, plus layer-level RTL execution of all 13 VGG-16 convolution layers at full size.",
          "Constrained-random stimulus ($urandom) in 12 benches, including the Winograd MAC, line buffer, channel accumulator, buffer banks, router, burst packer, RAM arbiter and output sequencer.",
          "Concurrent SVA assertions in the MAC, line buffer, filter-transform buffer, cluster and accumulator benches.",
          "Closed-form model checks: transform, buffer-read and memory-word counts measured in RTL are compared exactly against the analytical model.",
        ],
        planned: [
          "Avalon-MM protocol assertions: no simultaneous read/write, address/data stable under waitrequest, single-cycle done pulses.",
          "Top-level geometry sweep with golden compare (10 shapes, from a single 34×34 tile to 224×224 and 14×14×512).",
          "Memory stress: DDR latency, jitter and turnaround sweeps, random waitrequest, arbiter fairness and region-canary checks.",
          "Functional coverage (covergroups) and coverage-closure reporting. None is collected today.",
          "Formal verification of control FSMs and handshakes. Not started.",
          "UVM environment for the Avalon-MM boundary.",
        ],
      },
      {
        title: "Results",
        points: [
          "RTL execution of all 13 VGG-16 conv layers (F(4,3), Q=32) reproduces the closed-form transform, buffer-read and memory-word counts exactly: W+2 column transforms on each of 59,306 channel passes and 10 buffer reads on each of 2,163,732 column steps.",
          "Output values: 1,984 / 1,984 output lanes match a bit-accurate model of the arithmetic on a 64²×3→32 layer.",
          "Executed cycles are 0.954× the serial model in aggregate (2,280,501 vs 2,389,817), because fetch, compute and store overlap.",
          "Synthesis (Quartus Prime Pro 20.2, Arria-10 SX, F(4,3), Q=4): timing closes at 250 MHz; 293 multipliers pack into 147 DSP blocks (8.7%), 78.5% ALMs, 1,218 M20K, 6.47 W total.",
          "Throughput (model built on the RTL-validated counts): 539.8 GOPS on the VGG-16 backbone (93.7% of the arithmetic bound), 1.87 GOPS per multiplier and 83.5 GOPS/W.",
          "Reuse: 1.45× fewer column transforms, 1.20× fewer activation-buffer reads and 23.3× fewer DRAM read transactions than independent tile fetch.",
          "Accuracy: the bit-exact INT8 F(4,3) datapath loses 0.40 points of ImageNet top-1 on VGG-16.",
          "Bugs the testbenches exposed and fixed: a config-arrival-order race in the output stage buffer size, a weight-advance race in the weight buffer, a premature DRAIN→IDLE controller transition, and cluster pipeline registers that ignored their stage enables. About 100 fix commits are tracked in history.",
          "Reproducible: each bench is one Python generator plus one vlog/vsim command (seeded RNG, default_rng(0)), and the regression greps for PASS/FAIL.",
        ],
        planned: [
          "End-to-end golden match of the full accelerator on main (tb_accelerator_conv_32x32x3).",
          "On-board run on the Arria-10 SoC dev kit.",
        ],
      },
      {
        title: "Evidence",
        code: [
          {
            caption: "rtl/accelerator/cluster/transform/iact_transform.sv: F(2,3)/F(4,3) input transform, shift-and-add only",
            lang: "SystemVerilog",
            src: [
              "if (WINO_CONFIG == F4) begin : g_f43",
              "    assign transformed[0] = 4*d[0] - 5*d[2] + d[4];",
              "    assign transformed[1] = -4*d[1] - 4*d[2] + d[3] + d[4];",
              "    assign transformed[2] = 4*d[1] - 4*d[2] - d[3] + d[4];",
              "    assign transformed[3] = -2*d[1] - d[2] + 2*d[3] + d[4];",
              "    assign transformed[4] = 2*d[1] - d[2] - 2*d[3] + d[4];",
              "    assign transformed[5] = 4*d[1] - 5*d[3] + d[5];",
              "end else begin : g_f23",
              "    assign transformed[0] = d[0] - d[2];",
              "    assign transformed[1] = d[1] + d[2];",
              "    assign transformed[2] = d[2] - d[1];",
              "    assign transformed[3] = d[1] - d[3];",
              "end",
            ].join("\n"),
          },
          {
            caption: "pe/mac_mult_pool4.sv: six multipliers shared by four phase-skewed clusters",
            lang: "SystemVerilog",
            src: [
              "always_comb begin",
              "    p0_col = 2'd0;",
              "    p1_col = 2'd0;",
              "    for (int c = 0; c < 4; c++) begin",
              "        if (valid[c] && phase[c] == 2'd0) p0_col = 2'(c);",
              "        if (valid[c] && phase[c] == 2'd1) p1_col = 2'(c);",
              "    end",
              "    for (int k = 0; k < 5; k++) begin",
              "        mul_x[k] = x[p0_col][k];",
              "        mul_f[k] = f[p0_col][k];",
              "    end",
              "    mul_x[5] = x[p1_col][0];",
              "    mul_f[5] = f[p1_col][0];",
              "end",
            ].join("\n"),
          },
          {
            caption: "sim/tb_winograd_mac.sv: concurrent assertions from the shared SVA macro library",
            lang: "SystemVerilog",
            src: [
              "`ASSERT_NO_X(a_no_x, {M1, M2, M0_M3, result_valid})",
              "`ASSERT_IMPLY(a_fc_zero, layer_mode == NOC_MODE_FC, M1 == 0 && M2 == 0)",
              "`ASSERT_IMPLY(a_fc_valid, layer_mode == NOC_MODE_FC, result_valid == (act_en && filter_en))",
              "`ASSERT_IMPLY(a_conv_valid_needs_act, layer_mode == NOC_MODE_CONV && result_valid, act_en)",
              "`ASSERT_IMPLY(a_conv_valid_after_clear, layer_mode == NOC_MODE_CONV && clear_iacts, !result_valid)",
            ].join("\n"),
          },
          {
            caption: "tests/generate_cluster_test.py: golden model cross-checked four ways before use",
            lang: "Python",
            src: [
              'assert (wino2d == S * S * direct[:, :tiled]).all(), "2D Winograd != S^2 * direct"',
              'assert (AT @ lanes_1d == S * S * direct[:, :tiled]).all(), "vertical + lane 1D Winograd != S^2 * direct"',
              'assert (AT @ lanes_mac == S * S * direct).all(), "mac_row dataflow != S^2 * direct"',
              'assert fits(lanes_mac, DATA_WIDTH[m]) and fits(S * S * direct, DATA_WIDTH[m]), "cluster datapath overflow"',
            ].join("\n"),
          },
        ],
        images: [
          { caption: "Top-level architecture: one read port, one write port, Q cluster groups", src: "/images/winograd/fig-top-level.png" },
          { caption: "Seven-stage cluster pipeline with FC bypass", src: "/images/winograd/fig-cluster-pipeline.png" },
          { caption: "External read traffic over VGG-16: row-streamed vs independent tile fetch", src: "/images/winograd/traffic_measured.png" },
        ],
      },
    ],
  },
  {
    slug: "posit-multiplier",
    name: "Power-Efficient POSIT Multiplier",
    desc: "16-bit (es=1) posit multiplier in Verilog: LZD/LOD-based field extraction, mantissa multiply, regime/exponent re-encoding and GRS rounding. Synthesized in Synopsys Design Compiler on TSMC 65 nm, with a 4–7% power reduction from switching-activity analysis.",
    tags: ["Verilog", "Arithmetic", "ASIC", "Design Compiler"],
    arch: {
      nodes: [
        { id: "a", label: "Operand A", x: 10, y: 80, w: 100 },
        { id: "b", label: "Operand B", x: 10, y: 270, w: 100 },
        { id: "exa", label: "Extract (LZD/LOD)", x: 150, y: 80, w: 140 },
        { id: "exb", label: "Extract (LZD/LOD)", x: 150, y: 270, w: 140 },
        { id: "mul", label: "14×14 Mantissa ×", x: 330, y: 110, w: 140, accent: true },
        { id: "scl", label: "Scale Add rg+exp", x: 330, y: 240, w: 140 },
        { id: "norm", label: "Normalize", x: 510, y: 110, w: 130 },
        { id: "enc", label: "Regime/Exp Encode", x: 510, y: 240, w: 140 },
        { id: "spc", label: "Zero / NaR", x: 680, y: 110, w: 110 },
        { id: "rnd", label: "GRS Round", x: 680, y: 240, w: 110 },
        { id: "o", label: "Result O", x: 680, y: 340, w: 110 },
      ],
      edges: [
        ["a", "exa"], ["b", "exb"], ["exa", "mul"], ["exb", "mul"], ["exa", "scl"], ["exb", "scl"],
        ["mul", "norm"], ["norm", "enc"], ["scl", "enc"], ["enc", "rnd"], ["rnd", "o"], ["spc", "rnd", "ctrl"],
      ],
    },
    // Source: power_eff_vs_code repo (Vivado xsim / DC flow). Testbenches re-run in Questa 21.1 on 2026-11-13.
    sections: [
      {
        title: "Architecture",
        points: [
          "Fully combinational posit<16,1> multiplier: 5 RTL modules (posit, extraction, lzd, lod, booth) plus two exploratory variants (parameterized, Zhang-style packing).",
          "Extraction: each operand is conditionally inverted by its sign, then a hierarchical leading-zero detector and leading-one detector (built from 4-bit LZD/LOD cells) give the regime run length in one pass. A barrel shift aligns the exponent bit and the 13-bit fraction.",
          "Scale path: regime and exponent fold into a single signed scale factor per operand (rg_exp = 2·regime + exp), and the two are added.",
          "Mantissa path: 14×14 multiply of the fractions with hidden bits, then a one-bit normalization shift that also increments the scale on overflow.",
          "Re-encoding: the scale splits back into regime and exponent, and a signed arithmetic shift builds the regime run in place.",
          "Rounding: round-to-nearest-even from guard, round, sticky and LSB bits, then two's-complement negation for mixed-sign products.",
          "Special cases: zero operands force zero, and NaR (1000…0) on either input forces NaR.",
          "Radix-4 Booth multiplier (booth.v) written as a lower-power replacement for the behavioural mantissa multiply; not yet integrated.",
          "Earlier prototype (Dec 2024): a precision-scalable 32-bit datapath that runs as 4× posit8, 2× posit16 or 1× posit32, selected by a mode input, with shared complementer, LZD/LOD, shifter and a mode-gated Booth multiplier. It was restarted as the fixed posit<16,1> design above to get a clean, synthesizable baseline for the power study.",
        ],
      },
      {
        title: "Verification Architecture",
        points: [
          "Directed Verilog testbenches per module: posit_tb (full multiplier), booth_tb, extraction_tb, and 4-bit and 15-bit LZD/LOD benches.",
          "posit_tb and booth_tb are self-checking: each vector compares the DUT output against a hand-computed expected posit bit pattern and prints Passed/Failed.",
          "The extraction and LZD/LOD benches drive sweeps and are checked by waveform inspection, not by an automatic comparison.",
          "Simulated in Vivado xsim during development and re-run in Questa for this page. No reference model or scoreboard yet.",
        ],
      },
      {
        title: "Verification Strategy",
        points: [
          "Corner-case directed vectors for the full multiplier: positive × positive, negative regime, mixed signs, negative × negative, maximum regime (saturates to maxpos) and minimum regime (underflows to minpos).",
          "Unit-level checks of the leading-zero and leading-one detectors before integrating them into extraction.",
        ],
        planned: [
          "Bit-exact comparison against a software posit reference (e.g. SoftPosit) over random and exhaustive single-operand sweeps.",
          "Make the extraction and LZD/LOD benches self-checking.",
          "Fix the Booth multiplier's operand signedness, integrate it, and re-verify the full multiplier.",
          "Commit the power reports and switching-activity setup alongside the area and timing reports.",
        ],
      },
      {
        title: "Results",
        points: [
          "posit_tb: 6 / 6 directed vectors pass, including both regime extremes (re-run in Questa 21.1).",
          "booth_tb: 10 / 14 pass. All four failures have the MSB of operand A set. The Booth encoder treats A as two's-complement, while three of the expected values assume unsigned A, and the fourth expected value is itself wrong (the RTL gives the correct 8191²). Unsigned 14-bit mantissas need one more zero-extended Booth digit.",
          "Power: 4–7% reduction from switching-activity analysis in Design Compiler (measured outside this repo; reports not committed).",
          "Synthesis (Design Compiler, TSMC 65 nm tcbn65gpluswc, WCCOM worst-case corner): 1,064 leaf cells, 3,317.76 total cell area (library units), 10.30 ns critical path from A[15] through extraction, multiply and rounding to O[14].",
          "Bugs found by the directed tests and fixed: LZD/LOD count errors, rg_exp extraction, regime/exponent encoding, large-regime handling, normalization/rounding, and Booth sign extension. An earlier Zhang-style variant with wrong exponent, regime and rounding logic is kept in extra/ as a record.",
          "Reproducible: synthesis scripts and the DC command list are in synthesis/, and area, timing and QoR reports are committed.",
        ],
      },
      {
        title: "Evidence",
        code: [
          {
            caption: "extraction.v: regime run length from LZD/LOD, then align exponent and fraction",
            lang: "Verilog",
            src: [
              "wire [14:0] operand_ng = operand[15] ? ~operand[14:0] : operand[14:0];",
              "lzd lzd16(operand_ng, czip, vz);",
              "lod lod16(operand_ng, cone, vo);",
              "wire [4:0] rg = operand_ng[14] ? cone - 1 : -czip;",
              "wire [3:0] shift_rg = operand_ng[14] ? cone + vo : czip + vz;",
              "wire [14:0] shifted_op_neg = operand_ng << shift_rg;",
              "wire exp = shifted_op_neg[14];",
              "assign mantissa = shifted_op_neg[13:1];",
              "assign rg_exp = { rg, 1'b0 } + exp;",
            ].join("\n"),
          },
          {
            caption: "posit.v: GRS round-to-nearest-even and special-case handling",
            lang: "Verilog",
            src: [
              "wire G = tempAns[13];",
              "wire R = tempAns[12];",
              "wire S = |tempAns[11:0];",
              "wire L = tempAns[14];",
              "wire roundup = G & (R | S | L);",
              "wire [N-1:0] intermediateAns = { 1'b0, tempAns[28:28-N+2] } + roundup;",
              "",
              "wire special = (A[N-1] & ~|A[N-2:0] | B[N-1] & ~|B[N-2:0]);",
              "assign O = special ? inf : finalAns;",
            ].join("\n"),
          },
          {
            caption: "Questa 21.1 run of sim/posit_tb.v",
            lang: "log",
            src: [
              "# Passed: 0010100011110110 x 0001110101110001 = 0001001001111100",
              "# Passed: 0100010000000000 x 0111010000110100 = 0111010101000001",
              "# Passed: 0111001001010010 x 1111101101010010 = 1110011110001100",
              "# Passed: 1101111000010100 x 1111101101010010 = 0000001010000000",
              "# Passed: 0111111111011000 x 0111111011010010 = 0111111111111111",
              "# Passed: 0000000110000011 x 0000000000101111 = 0000000000000001",
            ].join("\n"),
          },
          {
            caption: "synthesis/RPT/report_qor_posit.txt (excerpt)",
            lang: "Design Compiler",
            src: [
              "Critical Path Length:         10.30",
              "Total Negative Slack:          0.00",
              "Leaf Cell Count:               1064",
              "Combinational Area:     3317.759997",
              "Total Number of Nets:          1199",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    slug: "depthwise-separable-cnn-accelerator",
    name: "Depthwise Separable CNN Accelerator",
    desc: "SystemVerilog accelerator for MobileNet-class depthwise separable convolution: chained depthwise and pointwise 8×8 PE arrays with an on-chip intermediate buffer, achieving ~20× speedup through dataflow parallelism.",
    tags: ["SystemVerilog", "CNN", "Parallelism"],
    arch: {
      nodes: [
        { id: "mem", label: "IFMAP Memory", x: 10, y: 175, w: 120 },
        { id: "wmem", label: "Weight Memory", x: 10, y: 320, w: 120 },
        { id: "fsm", label: "DSC Control FSM", x: 330, y: 20, w: 140 },
        { id: "dw", label: "DW Conv 8×8 PE", x: 170, y: 175, w: 150, accent: true },
        { id: "buf", label: "DW Output Buffer", x: 360, y: 175, w: 140 },
        { id: "pw", label: "PW Conv 8×8 PE", x: 540, y: 175, w: 150, accent: true },
        { id: "red", label: "ReLU / Quantize", x: 540, y: 320, w: 150 },
      ],
      edges: [
        ["mem", "dw"], ["wmem", "dw"], ["wmem", "pw"], ["dw", "buf"], ["buf", "pw"], ["pw", "red"],
        ["fsm", "dw", "ctrl"], ["fsm", "buf", "ctrl"], ["fsm", "pw", "ctrl"],
      ],
    },
    // Source: dws-cnn-accelerator-vscode repo. Benches re-run in Questa 21.1 on 2026-11-13.
    sections: [
      {
        title: "Architecture",
        points: [
          "Top level (dws_accelerator) runs three layer types: depthwise only, pointwise only, or the full depthwise-separable block (DW then PW), chosen per layer by conv_type.",
          "Two convolution units, one per stage, each built on an 8×8 PE array. The depthwise output is written to an on-chip intermediate buffer and read directly by the pointwise unit, so the intermediate feature map never goes back to external memory.",
          "Control FSM: IDLE → SETUP_DW → PROCESS_DW → BUFFER_DW_OUTPUT → SETUP_PW → PROCESS_PW → DONE. It latches the layer configuration and derives the PW input size from the DW output size.",
          "PE: registered 8-bit × 8-bit multiply into a 32-bit partial sum. Activations are forwarded down each column; weights are held per PE.",
          "Per-row adder trees reduce eight PE products to one partial sum per cycle. The tree is a parameterized ternary reduction, so any array width works (odd and even widths were both fixed and tested).",
          "Configurable for 1×1, 3×3, 5×5 and 7×7 kernels, inputs up to 224×224 and up to 512 channels; 8-bit activations and weights.",
          "Post-processing: ReLU and quantization back to 8 bits in a reducer stage, plus pooling and normalization blocks. Input, weight, partial-sum and FIFO buffer modules are in memory_units/.",
          "A systolic (psum-forwarding) PE-array variant was explored alongside the weight-broadcast array.",
        ],
      },
      {
        title: "Verification Architecture",
        points: [
          "Directed SystemVerilog testbenches for the PE, the PE array performing convolution, and the adder tree.",
          "NumPy reference convolution (tests/conv.ipynb) produces the golden outputs for the PE-array convolution test.",
          "Benches print results each cycle for comparison against the NumPy golden. The comparison is not yet automated.",
        ],
      },
      {
        title: "Verification Strategy",
        points: [
          "Bottom-up: PE first (product, enable/hold behaviour), then the PE array on a 4×4 input with a 3×3 kernel, then adder trees at odd and even widths.",
        ],
        planned: [
          "Self-checking benches that compare automatically against the NumPy golden.",
          "Full DW, PW and DSC layer tests with random tensors.",
          "Assertions on FSM handshakes and the intermediate-buffer read/write pointers.",
        ],
      },
      {
        title: "Results",
        points: [
          "~20× speedup through dataflow parallelism (measured outside this repo).",
          "PE-array convolution: a 4×4 input with a 3×3 kernel produces 348, 393, 528 and 573, matching the NumPy golden output exactly (re-run in Questa 21.1).",
          "PE test: products and enable-hold behaviour correct over all cycles.",
          "Bugs found and fixed during bring-up: adder-tree reduction for odd widths, PE-array output delays, and a redundant psum_in path removed from the PE.",
        ],
      },
      {
        title: "Evidence",
        code: [
          {
            caption: "core/pe.sv: registered multiply, activation forwarded to the next PE",
            lang: "SystemVerilog",
            src: [
              "always_ff @(posedge clk) begin",
              "    if (rst) begin",
              "        psum_out <= '0;",
              "        iact_out <= '0;",
              "    end else if(en) begin",
              "        iact_out <= iact;",
              "        psum_out <= iact * weight;",
              "    end",
              "end",
            ].join("\n"),
          },
          {
            caption: "core/adder_tree.sv: parameterized ternary reduction with remainder handling",
            lang: "SystemVerilog",
            src: [
              "for (n = 0; n < triplets; n++) begin : gen_triplets",
              "    assign tree[l+1][n] = tree[l][n*3] + tree[l][n*3+1] + tree[l][n*3+2];",
              "end",
              "",
              "if (remainder == 1) begin : gen_remainder1",
              "    assign tree[l+1][triplets] = tree[l][triplets*3];",
              "end else if (remainder == 2) begin : gen_remainder2",
              "    assign tree[l+1][triplets] = tree[l][triplets*3] + tree[l][triplets*3+1];",
              "end",
            ].join("\n"),
          },
          {
            caption: "NumPy golden (tests/conv.ipynb) vs RTL (sim/pe_array_conv_tb.sv, Questa 21.1)",
            lang: "log",
            src: [
              "NumPy: [[348. 393.]",
              "        [528. 573.]]",
              "",
              "RTL:   # -- Cycle 4 --  PSUM: 528",
              "       # -- Cycle 5 --  PSUM: 348",
              "       # -- Cycle 8 --  PSUM: 573",
              "       #                PSUM: 393",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    slug: "dft-systolic-arrays",
    name: "DFT for Systolic Arrays",
    desc: "Scan chains and BIST for systolic PE arrays, improving fault coverage and enabling structured post-silicon validation.",
    tags: ["DFT", "BIST", "Verification"],
    arch: {
      nodes: [
        { id: "ctl", label: "Test Controller", x: 20, y: 40, w: 130 },
        { id: "lfsr", label: "LFSR Pattern Gen", x: 20, y: 175, w: 130 },
        { id: "norm", label: "Normal Inputs", x: 20, y: 300, w: 130 },
        { id: "mux", label: "Test / Normal Mux", x: 200, y: 175, w: 140 },
        { id: "cg", label: "Clock Gate", x: 390, y: 40, w: 160 },
        { id: "arr", label: "4×4 Systolic PE Array", x: 390, y: 175, w: 160, accent: true },
        { id: "delta", label: "Delta Reg + Compare", x: 600, y: 110, w: 160 },
        { id: "out", label: "Results / Signatures", x: 600, y: 260, w: 160 },
      ],
      edges: [
        ["lfsr", "mux"], ["norm", "mux"], ["mux", "arr"], ["arr", "delta"], ["arr", "out"],
        ["ctl", "lfsr", "ctrl"], ["ctl", "mux", "ctrl"], ["ctl", "cg", "ctrl"], ["cg", "arr", "ctrl"],
      ],
    },
    // Source: pe_array_test_vscode repo. Benches re-run in Questa 21.1 on 2026-11-13.
    sections: [
      {
        title: "Architecture",
        points: [
          "Test architecture for low-power AI accelerators, following \"A Robust Test Architecture for Low-Power AI Accelerators\".",
          "4×4 systolic array of 8-bit MAC PEs with 24-bit partial sums. Weights flow right; activations and partial sums flow down.",
          "Each PE adds a delta register, captured on the falling edge of the gated clock, and an equality comparator. The comparator chooses between the normal MAC update and holding the delta value, which exposes faults in the MAC and comparator paths.",
          "Clock gating on the partial-sum and delta registers (gated_clk = clk & clk_gate_en), so test phases can switch the array off for low-power test.",
          "Test controller FSM: global reset, load zero weights, load test patterns, load weight patterns, capture, reset weights, shift out. It covers 68 patterns: 43 for the MAC and 25 for the comparator.",
          "Test compression: an LFSR (seed 0xACE1) expands pattern templates into weight, activation and partial-sum vectors, generated in four phases. Stuck-at-0/1 and 0→1 / 1→0 transition test types are supported.",
          "Top level muxes between test-pattern and normal-operation inputs, and forces the clock gate on in normal mode.",
        ],
      },
      {
        title: "Verification Architecture",
        points: [
          "Directed Verilog testbenches for the PE (MAC, delta capture, comparator path) and for the 4×4 array.",
          "The array bench drives random activations with the clock gate enabled and traces the partial sums as they skew through the array.",
          "Results are inspected from printed traces; the benches don't compare automatically yet.",
        ],
      },
      {
        title: "Verification Strategy",
        points: [
          "PE-level check of the MAC, delta capture and comparator-select behaviour before building the array.",
          "Array-level check of systolic partial-sum propagation under clock gating.",
        ],
        planned: [
          "Self-checking array bench against a software systolic model.",
          "Fault-injection campaign (stuck-at and transition faults on every PE) with per-fault detection logging.",
        ],
      },
      {
        title: "Results",
        points: [
          "Improved fault coverage over the unmodified array (measured outside this repo).",
          "PE bench: MAC results correct (4×5+10 = 30, 2×7+8 = 26, 9×2+3 = 21) with the delta register tracking the partial sum.",
          "Array bench: partial sums emerge after the expected 4-cycle systolic fill and propagate down the columns under clock gating.",
          "Bugs found and fixed: PE clock gating, systolic partial-sum passing between rows, and a timing race in the PE bench.",
        ],
      },
      {
        title: "Evidence",
        code: [
          {
            caption: "pe.v: comparator-selected MAC update and negedge delta capture on the gated clock",
            lang: "Verilog",
            src: [
              "wire comp_result = (psum_reg == delta_reg);",
              "",
              "always @(posedge gated_clk) begin",
              "    if (rst) begin",
              "        psum_reg <= 24'b0;",
              "    end else begin",
              "        // 1 → normal path, 0 → bypass MAC and use delta_reg value",
              "        if (comp_result) begin",
              "            psum_reg <= (weight_reg * iact_reg) + psum_in;",
              "        end else begin",
              "            psum_reg <= delta_reg;",
              "        end",
              "    end",
              "end",
              "",
              "always @(negedge gated_clk) begin",
              "    if (rst) begin",
              "        delta_reg <= 24'b0;",
              "    end else begin",
              "        delta_reg <= psum_reg;",
              "    end",
              "end",
            ].join("\n"),
          },
          {
            caption: "Questa 21.1 run of sim/pe_tb.v",
            lang: "log",
            src: [
              "# Time: 60000 |   4 x   5 +       10 =       30 | Delta:       10",
              "# Time: 80000 |   3 x   6 +        5 =       23 | Delta:       25",
              "# Time: 100000 |   2 x   7 +        8 =       26 | Delta:       26",
              "# Time: 130000 |   9 x   2 +        3 =       21 | Delta:       21",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    slug: "dnn-fault-tolerance",
    name: "Fault Tolerance Enhancement for DNNs",
    desc: "Investigated fault-tolerant architectures for deep neural network accelerators under hardware-induced error models.",
    tags: ["Reliability", "DNN Hardware"],
    arch: {
      nodes: [
        { id: "in", label: "Activations", x: 20, y: 170 },
        { id: "acc", label: "DNN Accelerator", x: 200, y: 170, accent: true },
        { id: "det", label: "Error Detection", x: 390, y: 170 },
        { id: "cor", label: "Correction", x: 570, y: 170 },
        { id: "fi", label: "Fault Injector", x: 200, y: 60 },
      ],
      edges: [["in", "acc"], ["acc", "det"], ["det", "cor"], ["fi", "acc", "ctrl"]],
    },
    sections: [{ title: "Architecture", points: ["Fault-tolerant DNN accelerator architectures evaluated under hardware-induced error models."] }],
  },
  {
    slug: "led-matrix-display",
    name: "Dynamic 32×64 LED Matrix Display",
    desc: "Xilinx FPGA design driving a high-resolution LED matrix at 30 fps, with UART-based visual data ingestion and clock/data synchronization.",
    tags: ["RTL", "FPGA", "UART"],
    arch: {
      nodes: [
        { id: "uart", label: "UART RX", x: 20, y: 170 },
        { id: "fb", label: "Frame Buffer", x: 190, y: 170 },
        { id: "scan", label: "Row Scan / PWM", x: 360, y: 170, accent: true },
        { id: "led", label: "32×64 LED Matrix", x: 540, y: 170, w: 140 },
        { id: "clk", label: "Clock / Sync", x: 275, y: 50 },
      ],
      edges: [["uart", "fb"], ["fb", "scan"], ["scan", "led"], ["clk", "fb", "ctrl"], ["clk", "scan", "ctrl"]],
    },
    sections: [{ title: "Architecture", points: ["UART ingestion into a frame buffer, row-scan/PWM driver refreshing a 32×64 LED matrix at 30 fps."] }],
  },
]
