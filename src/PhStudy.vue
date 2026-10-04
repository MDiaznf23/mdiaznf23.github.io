<script setup lang="ts">
// Put a photo in the public/ folder, then set it here, e.g. '/ph-prototype.jpg'
const photo: string | null = null

const scale = (v: number, a: number, b: number, c: number, d: number) =>
  c + ((v - a) / (b - a)) * (d - c)
const pts = (arr: number[][], fx: (n: number) => number, fy: (n: number) => number) =>
  arr.map(([a, b]) => `${fx(a)},${fy(b)}`).join(' ')

// Chart 1: 24 hour runs. Points are values reported in the paper, not raw logs.
const A = { l: 48, r: 40, t: 16, b: 40, w: 640, h: 300 }
const fxA = (h: number) => scale(h, 0, 24, A.l, A.w - A.r)
const fyA = (p: number) => scale(p, 8.5, 4.5, A.t, A.h - A.b)
const acid = [[0, 5.0], [3, 5.5], [24, 5.9]]
const base = [[0, 8.0], [4, 7.1], [12, 6.9], [24, 6.9]]
const hourTicks = [0, 4, 8, 12, 16, 20, 24]
const phTicksA = [5, 6, 7, 8]

// Chart 2: first 10 of 60 pH sensor samples against the reference meter (Table 2).
const B = { l: 48, r: 24, t: 16, b: 40, w: 640, h: 240 }
const fxB = (s: number) => scale(s, 1, 10, B.l + 12, B.w - B.r - 12)
const fyB = (p: number) => scale(p, 8.0, 6.5, B.t, B.h - B.b)
const samples = [7.79, 7.79, 6.95, 6.84, 6.84, 7.79, 6.88, 6.84, 7.79, 6.85]
const ref = 6.8
const phTicksB = [6.5, 7, 7.5, 8]

// Moisture sensors: raw ADC ranges on the ESP32's 0 to 4095 scale (Table 6).
const pct = (v: number) => (v / 4095) * 100
const seg = (r: number[]) => ({
  left: `min(${pct(r[0])}%, calc(100% - 4px))`,
  width: `max(${pct(r[1]) - pct(r[0])}%, 4px)`,
})
const sensors = [
  { name: 'Resistive', dry: [4095, 4095], wet: [690, 1779], sd: '240.43' },
  { name: 'Capacitive', dry: [2535, 2559], wet: [947, 1073], sd: '18.47' },
]
</script>

<template>
  <article class="study">
    <p class="venue">
      Published in Jurnal ELKON, Vol. 5 No. 2, December 2025, pages 50 to 59. First author, with
      Iqbaal Syaifudin and Agus Adhi Nugroho.
    </p>

    <img v-if="photo" :src="photo" alt="The pH controller prototype installed in a greenhouse bed" />

    <ul class="facts">
      <li><b>30 s</b><span>from deviation to pump</span></li>
      <li><b>24 h</b><span>per test scenario</span></li>
      <li><b>13x</b><span>steadier capacitive sensor</span></li>
      <li><b>60</b><span>samples against a reference meter</span></li>
    </ul>

    <dl>
      <dt>Problem</dt>
      <dd>
        Yellow disease cuts chili harvests, and soil pH outside roughly 6.0 to 7.0 is a main
        trigger because the plant can no longer absorb nutrients. Farmers correct pH by hand,
        which is slow and unmeasured.
      </dd>
      <dt>Solution</dt>
      <dd>
        A closed-loop controller on an ESP32. It reads soil pH every 5 minutes and doses
        dolomite or citric acid to pull it back, then waters briefly so the solution reaches the
        roots.
      </dd>
      <dt>Result</dt>
      <dd>
        The pump starts 30 seconds after a deviation is detected. In 24 hours pH moved from 5.0
        to 5.9 and from 8.0 to 6.9, with no pump on-off oscillation.
      </dd>
    </dl>

    <h4>Three blocks, one feedback loop</h4>
    <div class="arch">
      <div>
        <h5>Input</h5>
        <p>Soil pH electrode</p>
        <p>Soil moisture sensor</p>
      </div>
      <span class="arrow" aria-hidden="true">&rarr;</span>
      <div>
        <h5>Process</h5>
        <p>ESP32 with 12-bit ADC</p>
        <p>Hysteresis control, 5 minute cycle</p>
      </div>
      <span class="arrow" aria-hidden="true">&rarr;</span>
      <div>
        <h5>Output</h5>
        <p>Three 12 V pumps through relays</p>
        <p>20x4 LCD and 4 setup buttons</p>
      </div>
    </div>
    <p class="note">Powered from a 12 V lead-acid battery through a step-down converter.</p>

    <h4>The controller only acts outside a safe band</h4>
    <div class="zones">
      <div style="flex: 1.3"><b>Below 5.8</b><span>Dolomite pump, then water for 15 s</span></div>
      <div class="ok" style="flex: 1.2"><b>5.8 to 7.0</b><span>Pumps off. Water only if moisture is below 50%</span></div>
      <div style="flex: 1.5"><b>Above 7.0</b><span>Citric acid pump, then water for 15 s</span></div>
    </div>
    <p class="note">
      Watering for dry soil is blocked while a correction is running, so it never dilutes the
      solution.
    </p>

    <h4>Both starting points moved toward the target range</h4>
    <svg :viewBox="`0 0 ${A.w} ${A.h}`" role="img" aria-label="Line chart over 24 hours. Acidic soil rose from pH 5.0 to 5.9. Alkaline soil fell from 8.0 to 6.9. Target range is 6.0 to 7.0.">
      <rect :x="A.l" :y="fyA(7)" :width="A.w - A.l - A.r" :height="fyA(6) - fyA(7)" class="band" />
      <text :x="A.w - A.r - 6" :y="fyA(7) + 15" text-anchor="end" class="acc sub">Target range 6.0 to 7.0</text>
      <g v-for="p in phTicksA" :key="p">
        <line :x1="A.l" :x2="A.w - A.r" :y1="fyA(p)" :y2="fyA(p)" class="grid" />
        <text :x="A.l - 10" :y="fyA(p) + 4" text-anchor="end" class="sub">{{ p }}</text>
      </g>
      <text v-for="h in hourTicks" :key="h" :x="fxA(h)" :y="A.h - 18" text-anchor="middle" class="sub">{{ h }}</text>
      <text :x="(A.l + A.w - A.r) / 2" :y="A.h - 2" text-anchor="middle" class="sub">Hours</text>

      <polyline :points="pts(acid, fxA, fyA)" class="line acc-stroke" />
      <polyline :points="pts(base, fxA, fyA)" class="line" />
      <circle v-for="d in acid" :key="'a' + d[0]" :cx="fxA(d[0])" :cy="fyA(d[1])" r="4" class="acc-fill" />
      <circle v-for="d in base" :key="'b' + d[0]" :cx="fxA(d[0])" :cy="fyA(d[1])" r="4" fill="currentColor" />

      <text :x="fxA(24) + 8" :y="fyA(5.9) + 4" class="acc">5.9</text>
      <text :x="fxA(24) + 8" :y="fyA(6.9) + 4">6.9</text>
      <text :x="fxA(8)" :y="fyA(5.3)" class="acc">Acidic start, pH 5.0</text>
      <text :x="fxA(8)" :y="fyA(7.5)">Alkaline start, pH 8.0</text>
    </svg>
    <p class="note">
      Dots are values reported in the paper. Alkaline soil fell 0.9 in 4 hours, acidic soil rose
      0.5 in 3 hours. Dolomite acts more slowly than citric acid.
    </p>

    <h4>The capacitive moisture sensor is the stable one</h4>
    <p>
      I started with a resistive sensor because it is cheap. In saturated soil its readings swung
      widely and drifted as the probe corroded, so I tested a capacitive one against it.
    </p>
    <div class="ranges">
      <div v-for="s in sensors" :key="s.name" class="range">
        <span class="name">{{ s.name }}</span>
        <div class="track">
          <i class="dry" :style="seg(s.dry)"></i>
          <i class="wet" :style="seg(s.wet)"></i>
        </div>
        <span class="sd">SD {{ s.sd }}</span>
      </div>
      <div class="range axis">
        <span></span>
        <div><span>0</span><span>ADC 4095</span></div>
        <span></span>
      </div>
    </div>
    <p class="note">
      Raw ADC range in dry air (dark) and saturated water (green). SD is the standard deviation
      in water. Lower is steadier.
    </p>

    <h4>The pH electrode reads high and jumps</h4>
    <svg :viewBox="`0 0 ${B.w} ${B.h}`" role="img" aria-label="Ten pH sensor samples against a reference of 6.8. Several readings jump to 7.79.">
      <g v-for="p in phTicksB" :key="p">
        <line :x1="B.l" :x2="B.w - B.r" :y1="fyB(p)" :y2="fyB(p)" class="grid" />
        <text :x="B.l - 10" :y="fyB(p) + 4" text-anchor="end" class="sub">{{ p }}</text>
      </g>
      <line :x1="B.l" :x2="B.w - B.r" :y1="fyB(ref)" :y2="fyB(ref)" class="ref" />
      <text :x="B.w - B.r" :y="fyB(ref) + 16" text-anchor="end" class="sub">Reference meter 6.8</text>
      <polyline :points="samples.map((v, i) => `${fxB(i + 1)},${fyB(v)}`).join(' ')" class="line thin" />
      <circle v-for="(v, i) in samples" :key="i" :cx="fxB(i + 1)" :cy="fyB(v)" r="4" class="acc-fill" />
      <text v-for="i in 10" :key="'x' + i" :x="fxB(i)" :y="B.h - 18" text-anchor="middle" class="sub">{{ i }}</text>
      <text :x="(B.l + B.w - B.r) / 2" :y="B.h - 2" text-anchor="middle" class="sub">Sample (seconds)</text>
    </svg>
    <p class="note">
      First 10 of 60 samples. Mean 7.20 against 6.8, so 5.88% error with a standard deviation of
      0.42. The sensor is rated at 0.1 pH.
    </p>

    <h4>Limits I measured</h4>
    <ul class="limits">
      <li>
        Metal electrodes oxidize and lose sensitivity, so the pH reading works as an indicator,
        not a precise instrument.
      </li>
      <li>
        Soil buffers pH, so the target of 6.4 was not reached within 24 hours. At the measured
        rate, full convergence is estimated at 3 to 5 days.
      </li>
      <li>
        Dosing varied because solutions were mixed by hand and hose length changed pump flow. The
        loop absorbed this because it corrects from sensor readings, not from assumed volumes.
      </li>
    </ul>
  </article>
</template>

<style scoped>
.study { padding: 0 0 2rem; }
.venue { margin: 0 0 1.75rem; color: var(--muted); font-size: 0.9rem; }
img { display: block; width: 100%; height: auto; margin: 0 0 1.75rem; }

h4 { margin: 3.5rem 0 0.9rem; font-size: 1.05rem; font-weight: 500; }
h5 { margin: 0 0 0.4rem; font-size: 0.9rem; font-weight: 500; color: var(--muted); }
p { margin: 0 0 0.75rem; }
.note { margin: 0.6rem 0 0; color: var(--muted); font-size: 0.85rem; }

/* Key figures */
.facts {
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.facts li { padding: 1rem 1rem 1rem 0; }
.facts li + li { padding-left: 1rem; border-left: 1px solid var(--line); }
.facts b { display: block; font-size: 1.6rem; font-weight: 500; line-height: 1.2; }
.facts span { color: var(--muted); font-size: 0.8rem; line-height: 1.4; display: block; }

/* Architecture */
.arch { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 0.75rem; }
.arch > div { border: 1px solid var(--line); padding: 1rem; }
.arch p { margin: 0 0 0.3rem; font-size: 0.9rem; }
.arrow { align-self: center; color: var(--muted); }

/* Control zones */
.zones { display: flex; border: 1px solid var(--line); }
.zones > div { padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; }
.zones > div + div { border-left: 1px solid var(--line); }
.zones .ok { background: var(--band); }
.zones b { font-weight: 500; }
.zones span { color: var(--muted); font-size: 0.85rem; line-height: 1.45; }

/* SVG charts */
svg { display: block; width: 100%; height: auto; color: var(--fg); }
svg text { fill: currentColor; font-size: 12px; }
svg .sub { fill: var(--muted); }
svg .acc { fill: var(--accent); }
.band { fill: var(--band); }
.grid { stroke: var(--line); }
.line { fill: none; stroke: currentColor; stroke-width: 2; }
.line.thin { stroke: var(--line); stroke-width: 1.5; }
.acc-stroke { stroke: var(--accent); }
.acc-fill { fill: var(--accent); }
.ref { stroke: currentColor; stroke-width: 1; stroke-dasharray: 5 4; }

/* Moisture range bars */
.ranges { display: grid; gap: 0.9rem; margin-top: 1.25rem; }
.range { display: grid; grid-template-columns: 6rem 1fr 6rem; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
.range .sd { text-align: right; color: var(--muted); }
.track { position: relative; height: 0.9rem; background: var(--line); }
.track i { position: absolute; top: 0; bottom: 0; }
.track .dry { background: var(--fg); }
.track .wet { background: var(--accent); }
.axis > div { display: flex; justify-content: space-between; color: var(--muted); font-size: 0.8rem; }

.limits { margin: 0; padding-left: 1.1rem; }
.limits li { margin-bottom: 0.7rem; }

@media (max-width: 40rem) {
  .facts { grid-template-columns: repeat(2, 1fr); }
  .facts li:nth-child(3) { padding-left: 0; border-left: 0; }
  .facts li:nth-child(n + 3) { border-top: 1px solid var(--line); }
  .arch { grid-template-columns: 1fr; }
  .arrow { transform: rotate(90deg); justify-self: center; }
  .zones { flex-direction: column; }
  .zones > div { flex: none !important; }
  .zones > div + div { border-left: 0; border-top: 1px solid var(--line); }
  .range { grid-template-columns: 5rem 1fr; }
  .range .sd { grid-column: 2; text-align: left; }
}
</style>
