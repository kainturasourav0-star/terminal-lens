<!-- Updated: AI monitoring dashboard with real-time analytics -->
# 🌌 Terminal-Lens — Generative UI CLI Terminal

Terminal-Lens is a state-of-the-art,  cyberpunk-themed interactive command-line int erface (CLI) web application. It intercepts c ommon terminal commands and renders them as b eautiful, highly interactive, animated React  components directly inside the stdout stream.  

**Live Deployments:**
- **Vercel (Root Dom ain):** [https://terminal-lens.vercel.app](ht tps://terminal-lens.vercel.app)
- **GitHub Pages:** [https://kainturasourav0-star.github.i o/terminal-lens/](https://kainturasourav0-sta r.github.io/terminal-lens/)

---

## ✨ Key  Features

### 💻 Stateful Generative UIs
-  **`git status`**: Intercepts git status outpu t and renders an interactive file tree. Inclu des checkboxes to stage/unstage files individ ually, file status markers, and an interactiv e **Stage all files** button. Updates are sta te-synchronized back to the CLI shell.
- **`d ocker ps`**: Intercepts docker container grid s. Renders containers as dashboard cards show ing status, image, and ports. Includes a star t/stop toggler, a real-time CPU sparkline gra ph (using SVG path animations), and a togglea ble container log console.
- **`npm install`  / `yarn add`**: Displays a styled, animated p rogress bar simulating package resolution, fe tching, linking, and compiling. Includes a ca ncellation (`SIGKILL`) button.

### 🐚 Core  Mock Shell Commands
- **`help`**: Displays a vailable interactive and mock CLI commands.
-  **`whoami`**: Shows the current logged-in us er profile.
- **`pwd`**: Shows the current mo ck project folder path.
- **`date`**: Prints  the current timestamp.
- **`ls`**: Lists mock  directories and config files.
- **`neofetch` **: Outputs system hardware specifications al ongside a retro ASCII art brand logo.
- **`cl ear`**: Resets the terminal outputs.
- **Hist ory Navigation**: Use the **Arrow Up** and ** Arrow Down** keys to cycle through previous i nputs.

### 🎨 Retro Cyberpunk Neon Aesthet ics
- Ambient scanlines overlaying a dark gla ssmorphic terminal background.
- Staggered an d directional motion animations powered by Fr amer Motion.
- Neon glow dropshadows and text -shadow keyframe pulses.

---

## 🛠️ Tec h Stack
- **Framework**: React 18 (Vite + JSX )
- **Styling**: Tailwind CSS v3
- **Animatio ns**: Framer Motion
- **Icons**: Lucide React 
- **Deployment**: Vercel & GitHub Actions Wo rkflows

---

## 🚀 Getting Started

### 1.  Clone the repository
```bash
git clone https ://github.com/kainturasourav0-star/terminal-l ens.git
cd terminal-lens
```

### 2. Install  dependencies
```bash
npm install
```

### 3.  Run development server
```bash
npm run dev
`` `

### 4. Build for production
```bash
npm ru n build
```

---

## 👥 Contributors

- **T ushar Bisht** ([@tusharbisht01](https://githu b.com/tusharbisht01))
 
