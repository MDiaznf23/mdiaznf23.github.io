<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { projects, experience, links } from './projects'
import PhStudy from './PhStudy.vue'

const SITE = 'Muhammad Diaz Nur Farizki'

// Files in public/ are served from the site base, which also works on subpath hosting.
const asset = (path: string) => import.meta.env.BASE_URL + path

// Thin decorative lines for the hero, echoing the LinkedIn banner.
const waves = Array.from({ length: 16 }, (_, i) => {
  const y = 30 + i * 9
  return `M -100 ${y + 60} C 300 ${y - 110}, 700 ${y + 170}, 1300 ${y - 30}`
})

// Tiny hash router: "#/soil-ph" is a project page, anything else is home.
// In-page anchors like "#projects" keep working on the home page.
const parse = () => (location.hash.startsWith('#/') ? location.hash.slice(2) : '')
const slug = ref(parse())

const current = computed(() => projects.find((p) => p.slug === slug.value))
const next = computed(() => {
  const i = projects.findIndex((p) => p.slug === slug.value)
  return projects[(i + 1) % projects.length]
})
const featured = projects[0]
const rest = projects.slice(1)

function onHash() {
  const prev = slug.value
  slug.value = parse()
  if (slug.value === prev) return
  nextTick(() => {
    const id = location.hash.slice(1)
    const el = !current.value && id ? document.getElementById(id) : null
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  })
}

onMounted(() => window.addEventListener('hashchange', onHash))
onUnmounted(() => window.removeEventListener('hashchange', onHash))

watch(
  current,
  (p) => {
    document.title = p ? `${p.title} | ${SITE}` : SITE
  },
  { immediate: true },
)
</script>

<template>
  <nav class="nav">
    <a href="#top" class="brand">Diaz</a>
    <div>
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <!-- Project page -->
  <main v-if="current" class="detail">
    <a class="back" href="#projects">All projects</a>
    <h2 class="title">{{ current.title }}</h2>
    <p class="stack">{{ current.stack }}</p>
    <p v-if="current.repo" class="src"><a :href="current.repo">Source on GitHub</a></p>

    <div class="body">
      <PhStudy v-if="current.slug === 'soil-ph'" />
      <template v-else>
        <figure v-if="current.video" class="demo">
          <video
            controls
            playsinline
            preload="metadata"
            :poster="current.video.poster ? asset(current.video.poster) : undefined"
          >
            <source :src="asset(current.video.src)" type="video/mp4" />
            Your browser cannot play this video.
          </video>
          <figcaption v-if="current.video.caption">{{ current.video.caption }}</figcaption>
        </figure>

        <dl>
          <dt>Problem</dt>
          <dd>{{ current.problem }}</dd>
          <dt>Solution</dt>
          <dd>{{ current.solution }}</dd>
          <dt>Result</dt>
          <dd>{{ current.result }}</dd>
        </dl>
        <template v-if="current.details?.length">
          <h4 class="sub">Details</h4>
          <ul class="points">
            <li v-for="d in current.details" :key="d">{{ d }}</li>
          </ul>
        </template>
      </template>
    </div>

    <a class="next" :href="`#/${next.slug}`">
      <span>Next project</span>
      <b>{{ next.title }}</b>
    </a>
  </main>

  <!-- Home -->
  <template v-else>
    <header id="top" class="hero">
      <svg class="waves" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
        <path v-for="d in waves" :key="d" :d="d" />
      </svg>
      <h1>Muhammad Diaz Nur Farizki</h1>
      <p class="role">Electrical Engineer (IoT &amp; Automation)</p>
      <p class="contact">
        <a :href="`mailto:${links.email}`">{{ links.email }}</a>
        <a :href="links.github">GitHub</a>
        <a :href="links.linkedin">LinkedIn</a>
      </p>
    </header>

    <main>
      <section id="projects">
        <h2>Projects</h2>
        <p class="intro">Each one started as a problem I ran into myself.</p>

        <a :href="`#/${featured.slug}`" class="card feature">
          <div>
            <h3>{{ featured.title }}</h3>
            <p class="blurb">{{ featured.blurb }}</p>
            <p class="stack">{{ featured.stack }}</p>
          </div>
          <div class="viz">
            <svg viewBox="0 0 200 100" aria-hidden="true">
              <rect class="band" x="10" y="40" width="180" height="20" />
              <polyline class="acc" points="10,80 32,70 190,62" />
              <polyline points="10,20 40,38 100,42 190,42" />
            </svg>
            <p v-if="featured.figure" class="fig">
              <b>{{ featured.figure.value }}</b>
              <span>{{ featured.figure.label }}</span>
            </p>
          </div>
        </a>

        <div class="grid">
          <a v-for="p in rest" :key="p.slug" :href="`#/${p.slug}`" class="card">
            <h3>{{ p.title }}</h3>
            <p class="blurb">{{ p.blurb }}</p>
            <p class="stack">{{ p.stack }}</p>
            <p v-if="p.figure" class="fig">
              <b>{{ p.figure.value }}</b>
              <span>{{ p.figure.label }}</span>
            </p>
          </a>
        </div>
      </section>

      <section id="experience" class="split">
        <h2>Experience</h2>
        <ul class="experience">
          <li v-for="e in experience" :key="e.role">
            <span>{{ e.role }}<br /><span class="muted">{{ e.place }}</span></span>
            <span class="muted">{{ e.when }}</span>
          </li>
        </ul>
      </section>

      <section id="contact" class="split">
        <h2>Contact</h2>
        <p class="ask">
          Open to IoT, industrial automation and embedded systems work.
          <a :href="`mailto:${links.email}`">{{ links.email }}</a>
        </p>
      </section>
    </main>
  </template>
</template>

<style scoped>
/* Home: shorter hero so the first project card peeks above the fold */
.hero { min-height: 54vh; }

/* Project cards */
.card {
  display: block;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--line);
  padding: 1.75rem;
  transition: border-color 0.15s;
}
.card:hover { border-color: var(--fg); }
.card:hover h3 { text-decoration: underline; text-underline-offset: 0.25em; }
.card:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
.card h3 { margin: 0 0 0.5rem; }
.blurb { margin: 0 0 1rem; color: var(--muted); font-size: 0.95rem; }
.card .stack { margin: 0; font-size: 0.85rem; }

.fig { margin: 0.75rem 0 0; color: var(--muted); font-size: 0.85rem; }
.fig b { margin-right: 0.4rem; color: var(--fg); font-size: 1.5rem; font-weight: 500; }

.feature {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 3rem;
  align-items: center;
  padding: 2.5rem 3rem;
  margin-bottom: 1.25rem;
}
.feature h3 { font-size: 2rem; line-height: 1.2; margin-bottom: 0.75rem; }
.feature .blurb { max-width: 28rem; font-size: 1.05rem; }

.viz svg { display: block; width: 100%; height: auto; color: var(--fg); }
.viz .band { fill: var(--band); }
.viz polyline {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
.viz polyline.acc { stroke: var(--accent); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.25rem;
}
.grid .card { display: flex; flex-direction: column; }
.grid .fig { margin-top: auto; padding-top: 1.25rem; }

/* Experience and contact: heading on the left, content on the right */
.split {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 1rem 3rem;
}
.split h2 { margin: 0; }
.split .experience { margin-top: 0; }
.ask { margin: 0; max-width: 36rem; font-size: 1.15rem; }

/* Project page keeps a narrower reading column */
.detail { max-width: 52rem; }
.back { color: var(--muted); font-size: 0.9rem; }
.title {
  margin: 1.5rem 0 0.25rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1.15;
}
.detail .stack { margin: 0 0 0.25rem; }
.src { margin: 0; font-size: 0.9rem; }
.body { margin-top: 2.5rem; }
.sub { margin: 2.5rem 0 0.9rem; font-size: 1.05rem; font-weight: 500; }
.points { margin: 0; padding-left: 1.1rem; }
.points li { margin-bottom: 0.6rem; }

.demo { margin: 0 0 2.5rem; }
.demo video {
  display: block;
  width: 100%;
  height: auto;
  background: var(--line);
}
.demo figcaption { margin-top: 0.6rem; color: var(--muted); font-size: 0.85rem; }

.next {
  display: block;
  margin-top: 5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
  text-decoration: none;
}
.next span { display: block; color: var(--muted); font-size: 0.85rem; }
.next b { font-size: 1.15rem; font-weight: 500; }
.next:hover b { text-decoration: underline; text-underline-offset: 0.25em; }

@media (max-width: 48rem) {
  .feature { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; }
  .split { grid-template-columns: 1fr; }
}
</style>
