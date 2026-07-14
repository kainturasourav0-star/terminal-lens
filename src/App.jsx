import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Check, Terminal, FileText, Cpu, Square, Play, X, Plus } from 'lucide-react';

// CPU Sparkline graph using animated SVG paths
function CpuSparkline({ value, name }) {
  const [data, setData] = useState(() =>
    Array.from({ length: 20 }, () => Math.max(0, value + (Math.random() - 0.5) * 20))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev.slice(1),
        Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 15)),
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, [value]);

  const maxVal = 100;
  const height = 32;
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
          <Cpu className="w-3 h-3 text-primary shrink-0" /> CPU
        </span>
        <span className="text-[10px] font-mono text-primary">
          {data[data.length - 1]?.toFixed(0)}%
        </span>
      </div>
      <svg
        viewBox={`0 0 ${data.length * 5} ${height}`}
        className="w-full h-8 rounded overflow-hidden bg-secondary/50"
      >
        <defs>
          <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(184 100% 47%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(184 100% 47%)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d={`M0,${height} ${data.map((val, idx) => `L${idx * 5},${height - (val / maxVal) * height}`).join(" ")} L${(data.length - 1) * 5},${height} Z`}
          fill={`url(#grad-${name})`}
        />
        <polyline
          points={data.map((val, idx) => `${idx * 5},${height - (val / maxVal) * height}`).join(" ")}
          fill="none"
          stroke="hsl(184 100% 47%)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

// Git Status Interactive UI
function GitStatus({ files, onToggleStage, onGitAdd }) {
  const stagedCount = files.filter((f) => f.staged).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-primary/20 bg-card p-4 glow-cyan"
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <GitBranch className="w-4 h-4 text-primary shrink-0" />
        <span className="text-primary font-mono text-sm glow-text-cyan">main</span>
        <span className="text-muted-foreground text-xs ml-auto font-mono">
          {stagedCount}/{files.length} staged
        </span>
      </div>
      <div className="space-y-1">
        {files.map((file, index) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onToggleStage(index)}
            className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-secondary/60 transition-colors group"
          >
            <div
              className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all shrink-0 ${
                file.staged ? "bg-primary border-primary" : "border-muted-foreground/40"
              }`}
            >
              {file.staged && <Check className="w-3 h-3 text-primary-foreground shrink-0" />}
            </div>
            <Terminal className="w-3 h-3 text-muted-foreground shrink-0" />
            {file.status === "modified" ? (
              <FileText className="w-4 h-4 text-neon-amber shrink-0" />
            ) : (
              <Plus className="w-4 h-4 text-neon-green shrink-0" />
            )}
            <span className="font-mono text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {file.name}
            </span>
            <span
              className={`ml-auto text-xs font-mono shrink-0 ${
                file.status === "modified" ? "text-neon-amber" : "text-neon-green"
              }`}
            >
              {file.status === "modified" ? "M" : "U"}
            </span>
          </motion.div>
        ))}
      </div>
      {files.some((f) => !f.staged) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-border"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGitAdd();
            }}
            className="w-full py-2 rounded bg-primary/20 text-primary font-mono text-sm hover:bg-primary/30 transition-colors glow-cyan"
          >
            git add . (Stage all files)
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Docker Ps Interactive UI
function DockerPs({ containers, onToggleContainer }) {
  const [logsContainer, setLogsContainer] = useState(null);

  const toggleLogs = (id) => {
    setLogsContainer(logsContainer === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {containers.map((container, idx) => (
        <motion.div
          key={container.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.08 }}
          className={`rounded-lg border p-3 transition-all ${
            container.running ? "border-primary/30 bg-card glow-cyan" : "border-border bg-card/50 opacity-70"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className={`w-4 h-4 ${container.running ? "text-primary" : "text-muted-foreground"} shrink-0`} />
              <span className="font-mono text-sm text-foreground font-medium truncate">{container.name}</span>
            </div>
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                container.running ? "bg-neon-green animate-glow-pulse" : "bg-muted-foreground"
              }`}
            />
          </div>
          <div className="space-y-1 text-xs font-mono text-muted-foreground mb-3">
            <div className="flex justify-between">
              <span>Image</span>
              <span className="text-foreground truncate ml-2">{container.image}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className={container.running ? "text-neon-green" : "text-muted-foreground"}>
                {container.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ports</span>
              <span className="text-foreground truncate ml-2">{container.ports}</span>
            </div>
            <div className="flex justify-between">
              <span>ID</span>
              <span className="text-primary font-bold">{container.id.slice(0, 8)}</span>
            </div>
          </div>
          {container.running && <CpuSparkline value={container.cpu} name={container.name} />}
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleContainer(container.id);
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-mono transition-colors ${
                container.running
                  ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                  : "bg-neon-green/20 text-neon-green hover:bg-neon-green/30"
              }`}
            >
              {container.running ? <Square className="w-3 h-3 shrink-0" /> : <Play className="w-3 h-3 shrink-0" />}
              {container.running ? "Stop" : "Start"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLogs(container.id);
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-mono bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <FileText className="w-3 h-3 shrink-0" /> Logs
            </button>
          </div>
          {logsContainer === container.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 p-2 rounded bg-background/80 border border-border text-[10px] font-mono text-muted-foreground leading-relaxed max-h-24 overflow-y-auto"
            >
              <div>[{new Date().toISOString()}] Container {container.name} logs initialized.</div>
              <div>[{new Date().toISOString()}] Listening on: {container.ports}</div>
              <div>[{new Date().toISOString()}] Status: {container.running ? "RUNNING" : "STOPPED"}</div>
              {container.running ? (
                <div className="text-neon-green">Service online ✓</div>
              ) : (
                <div className="text-destructive">Service offline ⚠️</div>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Npm Install Progress UI
const npmInstallPhases = [
  { label: "Resolving packages...", phase: "[1/4]", duration: 1200 },
  { label: "Fetching packages...", phase: "[2/4]", duration: 2500 },
  { label: "Linking dependencies...", phase: "[3/4]", duration: 1800 },
  { label: "Building fresh packages...", phase: "[4/4]", duration: 2000 },
];

function NpmInstall() {
  const [percent, setPercent] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [packagesCount, setPackagesCount] = useState(0);

  useEffect(() => {
    if (cancelled || completed) return;
    const totalDuration = npmInstallPhases.reduce((acc, curr) => acc + curr.duration, 0);
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 50;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      setPercent(progress);
      setPackagesCount(Math.floor(progress * 2.47));

      let cumulative = 0;
      for (let i = 0; i < npmInstallPhases.length; i++) {
        cumulative += npmInstallPhases[i].duration;
        if (elapsed < cumulative) {
          setPhaseIndex(i);
          break;
        }
      }
      if (progress >= 100) {
        clearInterval(interval);
        setCompleted(true);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [cancelled, completed]);

  const activePhase = npmInstallPhases[phaseIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-primary/20 bg-card p-4 glow-cyan"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className={`w-4 h-4 ${completed ? "text-neon-green" : "text-primary"} shrink-0`} />
          <span className="font-mono text-sm text-foreground font-medium">
            {cancelled ? "Installation cancelled" : completed ? "Installation complete" : "Installing packages..."}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{packagesCount} packages</span>
      </div>
      {!cancelled && (
        <>
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-primary">
                {completed ? (
                  <span className="flex items-center gap-1 text-neon-green">
                    <Check className="w-3 h-3 shrink-0" /> Done
                  </span>
                ) : (
                  `${activePhase?.phase} ${activePhase?.label}`
                )}
              </span>
              <span className="text-muted-foreground">{percent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  width: `${percent}%`,
                  background: completed
                    ? "hsl(110 100% 54%)"
                    : "linear-gradient(90deg, hsl(184 100% 47%), hsl(184 100% 60%))",
                  backgroundSize: completed ? "auto" : "1rem 1rem",
                  backgroundImage: completed
                    ? undefined
                    : "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
                }}
                animate={completed ? {} : { backgroundPosition: ["1rem 0", "0 0"] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {npmInstallPhases.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  idx < phaseIndex
                    ? "bg-neon-green"
                    : idx === phaseIndex && !completed
                    ? "bg-primary animate-glow-pulse"
                    : completed
                    ? "bg-neon-green"
                    : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </>
      )}
      {cancelled && (
        <div className="text-xs font-mono text-destructive mt-1">
          Process terminated with SIGKILL at {percent.toFixed(0)}%
        </div>
      )}
      {!completed && !cancelled && (
        <button
          onClick={() => setCancelled(true)}
          className="w-full flex items-center justify-center gap-1 py-2 rounded bg-destructive/20 text-destructive font-mono text-xs hover:bg-destructive/30 transition-colors"
        >
          <X className="w-3 h-3 shrink-0" /> Cancel (SIGKILL)
        </button>
      )}
    </motion.div>
  );
}

// Single command/output line renderer
function CommandLineItem({ line, gitFiles, onToggleStage, onGitAdd, containers, onToggleContainer }) {
  if (line.type === "input") {
    return (
      <div className="flex items-start gap-2 font-mono text-sm">
        <span className="text-primary glow-text-cyan shrink-0">❯</span>
        <span className="text-foreground">{line.content}</span>
      </div>
    );
  } else if (line.type === "component") {
    return (
      <div className="my-2">
        {line.command === "git-status" && (
          <GitStatus files={gitFiles} onToggleStage={onToggleStage} onGitAdd={onGitAdd} />
        )}
        {line.command === "docker-ps" && (
          <DockerPs containers={containers} onToggleContainer={onToggleContainer} />
        )}
        {line.command === "npm-install" && <NpmInstall />}
      </div>
    );
  } else {
    return (
      <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {line.content}
      </pre>
    );
  }
}

// Main Terminal Component
export default function App() {
  const [lines, setLines] = useState([
    {
      id: "welcome",
      type: "output",
      content: `╔══════════════════════════════════════════╗
║  Terminal-Lens v1.0 — Generative UI CLI  ║
║  Type 'help' for available commands      ║
╚══════════════════════════════════════════╝`,
      timestamp: new Date(),
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Global State for Git Staging
  const [gitFiles, setGitFiles] = useState([
    { name: "src/App.tsx", status: "modified", staged: false },
    { name: "src/components/Header.tsx", status: "modified", staged: false },
    { name: "src/utils/api.ts", status: "modified", staged: false },
    { name: "src/components/NewWidget.tsx", status: "untracked", staged: false },
    { name: "src/hooks/useAuth.ts", status: "untracked", staged: false },
    { name: "tests/integration.test.ts", status: "untracked", staged: false },
  ]);

  // Global State for Docker Containers
  const [containers, setContainers] = useState([
    { id: "a1b2c3d4e5f6", image: "nginx:latest", status: "Up 2 hours", running: true, ports: "0.0.0.0:80->80/tcp", name: "web-proxy", cpu: 12 },
    { id: "f6e5d4c3b2a1", image: "postgres:15", status: "Up 5 hours", running: true, ports: "0.0.0.0:5432->5432/tcp", name: "db-primary", cpu: 34 },
    { id: "1a2b3c4d5e6f", image: "redis:7", status: "Up 5 hours", running: true, ports: "0.0.0.0:6379->6379/tcp", name: "cache-layer", cpu: 8 },
    { id: "6f5e4d3c2b1a", image: "node:20", status: "Exited (0)", running: false, ports: "-", name: "api-worker", cpu: 0 },
    { id: "b1c2d3e4f5a6", image: "grafana:10", status: "Up 1 hour", running: true, ports: "0.0.0.0:3000->3000/tcp", name: "monitoring", cpu: 22 },
  ]);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [lines]);

  // Auto focus input on mount and on page click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleToggleStage = (index) => {
    setGitFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, staged: !f.staged } : f))
    );
  };

  const handleGitAddAll = () => {
    setGitFiles((prev) => prev.map((f) => ({ ...f, staged: true })));
  };

  const handleToggleContainer = (id) => {
    setContainers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextRunning = !c.running;
          return {
            ...c,
            running: nextRunning,
            status: nextRunning ? "Up just now" : "Exited (0)",
            cpu: nextRunning ? Math.floor(Math.random() * 30) + 5 : 0,
          };
        }
        return c;
      })
    );
  };

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    setHistory((prev) => [cmdText, ...prev]);
    setHistoryIndex(-1);

    const lower = trimmed.toLowerCase();
    const inputLine = {
      id: `input-${Date.now()}`,
      type: "input",
      content: cmdText,
      timestamp: new Date(),
    };

    if (lower === "clear") {
      setLines([]);
      return;
    }

    if (lower === "help") {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: `Terminal-Lens v1.0 — Generative UI Terminal

Available intercepted commands:
  git status     → Interactive file tree with staging
  docker ps      → Container grid with controls
  npm install    → Animated progress bar

Other commands:
  whoami         → Displays current user
  pwd            → Displays current directory
  date           → Displays current date and time
  ls             → Lists directory contents
  neofetch       → Displays system info with retro ASCII art
  clear          → Clears the terminal screen

Type 'clear' to reset the terminal.`,
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower.startsWith("git status")) {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "component",
        command: "git-status",
        content: "",
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower.startsWith("git add")) {
      let stagedFiles;
      if (lower === "git add ." || lower === "git add -a" || lower === "git add --all") {
        stagedFiles = gitFiles.map((f) => ({ ...f, staged: true }));
        setGitFiles(stagedFiles);
        const outputLine = {
          id: `output-${Date.now()}`,
          type: "output",
          content: "Staged all untracked and modified files.",
          timestamp: new Date(),
        };
        setLines((prev) => [...prev, inputLine, outputLine]);
      } else {
        const filename = trimmed.substring(7).trim();
        let found = false;
        stagedFiles = gitFiles.map((f) => {
          if (f.name === filename || f.name.endsWith(filename)) {
            found = true;
            return { ...f, staged: true };
          }
          return f;
        });
        if (found) {
          setGitFiles(stagedFiles);
          const outputLine = {
            id: `output-${Date.now()}`,
            type: "output",
            content: `Staged file: ${filename}`,
            timestamp: new Date(),
          };
          setLines((prev) => [...prev, inputLine, outputLine]);
        } else {
          const outputLine = {
            id: `output-${Date.now()}`,
            type: "output",
            content: `fatal: pathspec '${filename}' did not match any files`,
            timestamp: new Date(),
          };
          setLines((prev) => [...prev, inputLine, outputLine]);
        }
      }
    } else if (lower.startsWith("docker ps")) {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "component",
        command: "docker-ps",
        content: "",
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower.startsWith("npm install") || lower.startsWith("yarn add")) {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "component",
        command: "npm-install",
        content: "",
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower === "whoami") {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: "root@terminal-lens",
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower === "pwd") {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: "/home/user/projects/terminal-lens",
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower === "date") {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: new Date().toString(),
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower === "ls") {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: "src/  node_modules/  package.json  tailwind.config.js  vite.config.js  index.html",
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else if (lower === "neofetch") {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: `
  ████████╗██╗     
  ╚══██╔══╝██║     Terminal-Lens v1.0
     ██║   ██║     ─────────────────
     ██║   ██║     OS: Terminal-Lens/Web
     ██║   ██║     Shell: TL-Shell 1.0
     ╚═╝   ╚══════╝Theme: Cyberpunk Neon
                   Font: JetBrains Mono`,
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    } else {
      const outputLine = {
        id: `output-${Date.now()}`,
        type: "output",
        content: `bash: command not found: ${trimmed}`,
        timestamp: new Date(),
      };
      setLines((prev) => [...prev, inputLine, outputLine]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
      setInputVal("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-background scanline select-none overflow-hidden"
      onClick={handleTerminalClick}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-card border-b border-border shrink-0">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-neon-amber/80" />
          <div className="w-3 h-3 rounded-full bg-neon-green/80" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono truncate">
          <Terminal className="w-3.5 h-3.5 text-primary shrink-0 animate-glow-pulse" />
          <span className="font-semibold text-foreground">terminal-lens</span>
          <span className="text-primary/50 shrink-0">—</span>
          <span className="text-primary/60 text-xs shrink-0 truncate">~/projects/terminal-lens</span>
        </div>
        <div className="ml-auto text-[10px] font-mono text-neon-green/80 flex items-center gap-1.5 shrink-0 animate-glow-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block" />
          LIVE
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10 select-text"
      >
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CommandLineItem
                line={line}
                gitFiles={gitFiles}
                onToggleStage={handleToggleStage}
                onGitAdd={handleGitAddAll}
                containers={containers}
                onToggleContainer={handleToggleContainer}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Terminal Input */}
      <div className="border-t border-border px-4 py-3 bg-card/50 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-primary glow-text-cyan shrink-0 font-mono text-sm">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground font-mono text-sm outline-none placeholder:text-muted-foreground/40 caret-primary"
            placeholder="Type a command..."
            spellCheck={false}
            autoComplete="off"
          />
          <span className="w-2 h-5 bg-primary/70 animate-cursor-blink rounded-sm shrink-0" />
        </div>
      </div>
    </div>
  );
}
