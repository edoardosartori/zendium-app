import { useEffect, useRef, useState } from "react";

const TITLE_LINES = [
  "╔══════════════════════════╗",
  "║      FILE EXPLORER       ║",
  "╚══════════════════════════╝",
];

const POLL_INTERVAL = 1500;

type ReadDirResult = Awaited<
  ReturnType<typeof window.zendium.filesystem.readDir>
>;
type DirItem = Extract<ReadDirResult, { available: true }>["items"][number];

const EXTENSION_COLORS: Record<string, string> = {
  js: "#FAC775",
  jsx: "#FAC775",
  ts: "#bd3781",
  tsx: "#85B7EB",
  json: "#7d77bc",
  md: "#85B7EB",
  css: "#D4537E",
  scss: "#D4537E",
  html: "#6ed66a",
  py: "#639922",
  sh: "#55ff55",
  yml: "#B4B2A9",
  yaml: "#B4B2A9",
  env: "#E24B4A",
  gitignore: "#5F5E5A",
  png: "#7F77DD",
  jpg: "#7F77DD",
  jpeg: "#7F77DD",
  svg: "#7F77DD",
};

const DEFAULT_FILE_COLOR = "#55ff55";
const DIR_COLOR = "#F0997B";

function getFileColor(name: string): string {
  const parts = name.split(".");

  if (parts.length === 1) {
    return DEFAULT_FILE_COLOR;
  }

  const ext = parts[parts.length - 1].toLowerCase();

  return EXTENSION_COLORS[ext] ?? DEFAULT_FILE_COLOR;
}

function getPrefix(index: number, total: number): string {
  const isLast = index === total - 1;
  return isLast ? "└─ " : "├─ ";
}

export default function UpperRightPanel() {
  const [cwd, setCwd] = useState<string | null>(null);
  const [items, setItems] = useState<DirItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const lastCwdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      const cwdResult = await window.zendium.terminal.getCwd();

      if (!mounted) return;

      if (!cwdResult.available) {
        setError("TERMINAL NOT AVAILABLE");
        return;
      }

      if (cwdResult.cwd === lastCwdRef.current) {
        return;
      }

      lastCwdRef.current = cwdResult.cwd;
      setCwd(cwdResult.cwd);

      const dirResult = await window.zendium.filesystem.readDir(cwdResult.cwd);

      if (!mounted) return;

      if (!dirResult.available) {
        setError("UNABLE TO READ DIRECTORY");
        setItems([]);
        return;
      }

      setError(null);
      setItems(dirResult.items);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="panel panel--upper-right">
      <div className="panel-title">
        {TITLE_LINES.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="panel-text file-explorer" key={cwd}>
        {cwd && <div className="file-explorer-path">{cwd}</div>}

        {error && <div className="file-explorer-error">{error}</div>}

        {!error &&
          items.map((item, index) => (
            <div
              key={item.name}
              className="file-explorer-item"
              style={{
                color: item.isDirectory ? DIR_COLOR : getFileColor(item.name),
                animationDelay: `${index * 80}ms`,
              }}
            >
              {getPrefix(index, items.length)}
              {item.name}
              {item.isDirectory ? "/" : ""}
            </div>
          ))}
      </div>
    </div>
  );
}

console.log("UpperRightPanel rendered");
