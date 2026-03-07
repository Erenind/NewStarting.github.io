# AI Agent Instructions for NewStarting Portfolio

## Project Overview
A personal portfolio website showcasing a life transition with animated visual storytelling. Single-page application featuring GSAP animations, theme switching, and a scrollable history section.

**Key Characteristics:**
- No build system (vanilla HTML/CSS/JavaScript)
- GSAP 3.x for all animations and scroll-triggered effects
- SCSS for styling with theme variables (light/dark mode)
- Modular JS using dynamic imports in `DOMContentLoaded`

## Architecture

### Core Structure
```
index.html              → Entry point, semantic sections: home-page, history-scroll
js/
  ├── main.js          → Bootstrap: registers plugins, imports utilities and animations
  ├── animation/       → GSAP timeline animations triggered on load or scroll
  └── utils/           → Utility modules (color-mode, topBar, smoothScroll)
css/
  ├── style.scss       → SCSS source file (compiles to style.css)
  └── scss/            → Theme variables, component styles
```

### Critical Design Patterns

**GSAP Integration:**
- Loaded from local minified copies: `js/animation/gsap.min.js` and `ScrollTrigger.min.js`
- Plugin registration: `gsap.registerPlugin(ScrollTrigger)` in main.js
- Timelines created per animation file (e.g., header, planets, history)
- Position/rotation calculated mathematically (see `animation-planets.js`: radius=233px, 3-planet orbit)

**Theme System:**
- `data-theme="light"|"dark"` attribute on document root
- CSS variables defined in `scss/_variables.scss` using OKLCH color space
- Auto-detects system preference via `window.matchMedia('(prefers-color-scheme: dark)')`
- Listens for OS theme changes and updates DOM dynamically

**Module Imports:**
- Dynamic `import()` pattern in `DOMContentLoaded` for utilities and animations
- Each animation file modifies DOM directly (no export/return required)
- Order matters: header animation → planets animation → history animation

## Development Workflows

### CSS/SCSS Changes
- Edit source: `css/style.scss` (main entry) and component files in `css/scss/`
- Compile SCSS to CSS manually when needed (no watch script exists)
- Global theme colors in `_variables.scss`; component-specific styles in `_*.scss` files
- Color format: OKLCH (modern perceptually-uniform color space)

### Animation Modifications
- Each animation lives in separate file: `js/animation/animation-*.js`
- Timelines use relative timing (`"-=0.2"` for overlap)
- Planet animation calculated from `rotateCenterCoordinate` and trigonometry
- ScrollTrigger animations would go in `animation-history.js` (currently minimal)

### Testing Changes
- No build step needed; changes take effect on page reload
- Open `index.html` in browser directly (static file, no server required)
- Browser DevTools: inspect theme switching and GSAP timeline in console

## Key Implementation Details

**Planet Animation Logic** (`animation-planets.js`):
- 3 planets orbit a center point with trigonometric positioning
- Outer duration: 5s, inner duration: 4s, buffer time: 300ms
- Uses `gsap.set()` for initial positioning, rotation animations applied separately
- `currentIndex` tracks active planet; animation cycles through them

**Color Mode Utility** (`color-mode.js`):
- No localStorage persistence (theme resets to system preference on refresh)
- Event listener on `systemTheme` MediaQueryList for dynamic OS theme changes
- Updates `data-theme` attribute immediately (triggers CSS variable cascade)

**Top Bar Structure**:
- Fixed positioning, flexbox layout
- Title block and navigation block have animated width (from 0)
- Navigation block right-side color changes with theme

## Important Files to Know
- `.github/copilot-instructions.md` ← You are here
- `index.html` — Don't move `<script>` tags; order matters (GSAP, ScrollTrigger, main.js)
- `css/style.scss` — Modify this, not style.css directly
- `js/main.js` — Modification point for adding/removing animations
- `js/animation/animation-planets.js` — Math-heavy; core visual feature

## Common Tasks

**Add a new animation:**
1. Create `js/animation/animation-*.js` with GSAP timeline
2. Import it in `main.js`: `import("./animation/animation-*.js")`
3. Ensure DOM elements exist in `index.html`

**Adjust theme colors:**
1. Edit `:root[data-theme="light"]` or `:root[data-theme="dark"]` in `scss/_variables.scss`
2. Recompile SCSS to CSS, or manually update `style.css`

**Change animation timing:**
1. Modify timeline durations in respective `animation-*.js` files
2. Use GSAP timeline labels for complex sequences
