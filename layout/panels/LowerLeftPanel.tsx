import HudCorners from "./HudCorners";

const COMMANDS = [
  "pwd - current directory",
  "ls - list files + -la fpr details",
  "cd .. - go up one level",
  "cd ~ - go to home",
  "cd - - go to previous directory",
  "mkdir foldername - create folder",
  "cp source destination - copy files",
  "cp -r source dest. - copy folders",
  "mv source destination - move/rename",
  "rm file.txt - delete file",
  "rm -r foldername - delete folder",
  "cat file.txt - show file content",
  "head file.txt - show first lines",
  'find . -name "*.txt" - search files',
  'grep "text" file.txt - search in file',
  "code . - open VS Code",
  "firefox - open Firefox",
  "nautilus . - open file manager",
  "gedit file.txt - open text editor",
  "gnome-terminal - open new terminal",
  "xterm - open basic terminal",
  "kill PID - kill a process by ID",
  "whois domain.com - domain info",
  "ip a - show IP addresses",
  "history - show command history",
];

const TITLE_LINES = [
  "╔══════════════════════════╗",
  "║   USEFUL COMMANDS LIST   ║",
  "╚══════════════════════════╝",
];

export default function LowerLeftPanel() {
  return (
    <div className="panel panel--upper-left panel--hud">
      <HudCorners />
      <div className="panel-title glow-text">
        {TITLE_LINES.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="panel-text glow-text--subtle">
        {COMMANDS.map((cmd, i) => (
          <div key={i}>{cmd}</div>
        ))}
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("LowerLeftPanel rendered");
}

