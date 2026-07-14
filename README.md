# 🌌 Terminal-Lens — Generative UI CLI Terminal

Terminal-Lens is a state-of-the-art, cyberpunk-themed interactive command-line interface (CLI) web application. It intercepts common terminal commands and renders them as beautiful, highly interactive, animated React components directly inside the stdout stream. 

**Live Deployments:**
- **Vercel (Root Domain):** [https://terminal-lens.vercel.app](https://terminal-lens.vercel.app)
- **GitHub Pages:** [https://kainturasourav0-star.github.io/terminal-lens/](https://kainturasourav0-star.github.io/terminal-lens/)

---

## ✨ Key Features

### 💻 Stateful Generative UIs
- **`git status`**: Intercepts git status output and renders an interactive file tree. Includes checkboxes to stage/unstage files individually, file status markers, and an interactive **Stage all files** button. Updates are state-synchronized back to the CLI shell.
- **`docker ps`**: Intercepts docker container grids. Renders containers as dashboard cards showing status, image, and ports. Includes a start/stop toggler, a real-time CPU sparkline graph (using SVG path animations), and a toggleable container log console.
- **`npm install` / `yarn add`**: Displays a styled, animated progress bar simulating package resolution, fetching, linking, and compiling. Includes a cancellation (`SIGKILL`) button.

### 🐚 Core Mock Shell Commands
- **`help`**: Displays available interactive and mock CLI commands.
- **`whoami`**: Shows the current logged-in user profile.
- **`pwd`**: Shows the current mock project folder path.
- **`date`**: Prints the current timestamp.
- **`ls`**: Lists mock directories and config files.
- **`neofetch`**: Outputs system hardware specifications alongside a retro ASCII art brand logo.
- **`clear`**: Resets the terminal outputs.
- **History Navigation**: Use the **Arrow Up** and **Arrow Down** keys to cycle through previous inputs.

### 🎨 Retro Cyberpunk Neon Aesthetics
- Ambient scanlines overlaying a dark glassmorphic terminal background.
- Staggered and directional motion animations powered by Framer Motion.
- Neon glow dropshadows and text-shadow keyframe pulses.

---

## 🛠️ Tech Stack
- **Framework**: React 18 (Vite + JSX)
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel & GitHub Actions Workflows

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kainturasourav0-star/terminal-lens.git
cd terminal-lens
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 👥 Contributors
- **Sourav Kaintura** ([@kainturasourav0-star](https://github.com/kainturasourav0-star))
- **Tushar Choudhary** ([@Tudhar](https://github.com/Tudhar))
- **Tushar Bisht** ([@tusharbisht01](https://github.com/tusharbisht01))
