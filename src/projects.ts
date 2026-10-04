// All site content lives here. Edit text, not components.

export const links = {
  email: 'muhammaddiaznurfarizki@gmail.com',
  github: 'https://github.com/MDiaznf23',
  linkedin: 'https://www.linkedin.com/in/muhammad-diaz-nur-farizki-2aa67a1b3/',
}

export interface Project {
  slug: string
  title: string
  stack: string
  blurb: string
  // Shown at the bottom of the home card, e.g. stars or "Internal"
  figure?: { value: string; label: string }
  // Paths are relative to the public/ folder, e.g. 'videos/demo.mp4'
  video?: { src: string; poster?: string; caption?: string }
  problem: string
  solution: string
  result: string
  details?: string[]
  repo?: string
}

// The first project is shown large on the home page and has a custom
// detail page (PhStudy.vue). The rest use the generic detail layout.
export const projects: Project[] = [
  {
    slug: 'soil-ph',
    title: 'Soil pH control for chili greenhouses',
    stack: 'ESP32, C++, pH and moisture sensors',
    blurb: 'Soil pH drives yellow disease in chili. This controller measures it and corrects it automatically.',
    figure: { value: '30 s', label: 'from deviation to pump' },
    problem:
      'Yellow disease cuts chili harvests, and soil pH outside roughly 6.0 to 7.0 is a main trigger. Farmers correct pH by hand.',
    solution:
      'A closed-loop ESP32 controller that doses dolomite or citric acid based on live pH readings.',
    result: 'In 24 hours pH moved from 5.0 to 5.9 and from 8.0 to 6.9.',
    repo: 'https://github.com/MDiaznf23/ph-monitoring-system-prototype',
  },
  {
    slug: 'inventory',
    title: 'Barcode spare parts inventory',
    stack: 'Qt, SQLite',
    blurb: 'Thousands of spare parts were typed from paper into Excel by hand.',
    figure: { value: 'Internal', label: 'Nihon Seiki Indonesia, not public' },
    problem:
      'Thousands of SKUs were copied from paper into Excel by hand. It was slow and error-prone.',
    solution:
      'Removed redundant steps and standardized the data structure, then replaced the spreadsheet with a barcode-based app.',
    result: 'Less manual input, fewer errors and more reliable data.',
    details: [
      'Built at Nihon Seiki Indonesia. It is a company project, so the source is not public.',
      'Diagnosed the process first, then built the tool. Some of the gain came from removing steps.',
      'Qt for the interface and SQLite for storage.',
    ],
  },
  {
    slug: 'autoricing',
    title: 'simple-autoricing-i3wm-dotfiles',
    stack: 'i3, EWW, Python, Material 3',
    blurb: 'Changing a wallpaper meant re-coloring every app by hand.',
    figure: { value: '201', label: 'GitHub stars' },
    video: {
      src: 'videos/autoricing.mp4',
      poster: 'videos/autoricing.jpg',
      caption: 'Changing the wallpaper re-themes the whole desktop.',
    },
    problem:
      'Every wallpaper change meant hand-editing colors in the configs of the bar, terminal, launcher and notifications.',
    solution:
      'm3wal extracts a Material 3 palette from the wallpaper and fills a template for each app. The installer backs up existing configs first.',
    result: 'One command re-themes the whole desktop.',
    details: [
      'Themes i3, EWW, Alacritty, Rofi, Dunst, Fish and Picom from one palette.',
      'Seven Material 3 variants, from Vibrant to Monochrome.',
      'Hook scripts run after each theme so apps can reload their colors.',
      'm3wal is a separate Python tool, so it can be scripted on its own.',
    ],
    repo: 'https://github.com/MDiaznf23/simple-autoricing-i3wm-dotfiles',
  },
  {
    slug: 'voicewm',
    title: 'voicewm',
    stack: 'Rust, Vosk',
    blurb: 'Open apps by speaking when your hands are tired.',
    figure: { value: '18', label: 'GitHub stars' },
    video: {
      src: 'videos/voicewm.mp4',
      poster: 'videos/voicewm.jpg',
      caption: 'Saying an app name opens it.',
    },
    problem:
      'When my hands were tired, even opening an app from the keyboard felt like work.',
    solution:
      'Say the app name and voicewm opens it. Speech is recognized offline with Vosk, so nothing leaves the machine and no account is needed.',
    result: 'A small Rust tool for Linux window managers.',
    details: [
      'Runs fully offline.',
      'Written in Rust, with the Vosk speech engine.',
      'Kept deliberately simple: it launches apps and does little else.',
    ],
    repo: 'https://github.com/MDiaznf23/voicewm',
  },
]

export const experience = [
  {
    role: 'IoT & Automation Engineer',
    place: 'Hino Motors Manufacturing Indonesia',
    when: '2026 to now',
  },
  {
    role: 'Maintenance Technician',
    place: 'Nihon Seiki Indonesia',
    when: '2024',
  },
  {
    role: 'Dancing Robot division, national finalist KRI 2023 and 2024',
    place: 'Unissula Robotics Team',
    when: '2022 to 2025',
  },
]
