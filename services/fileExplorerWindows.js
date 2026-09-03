import fs from "node:fs/promises";

export function getTerminalCwd() {
  try {
    const cwd = process.cwd();

    return {
      available: true,
      cwd,
    };
  } catch (error) {
    console.error("FILEEXPLORER WINDOWS: failed to get terminal cwd:", error);

    return {
      available: false,
      error: "CWD_UNAVAILABLE",
    };
  }
}

export async function readDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, {
      withFileTypes: true,
    });

    const items = entries
      .map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        isSymlink: entry.isSymbolicLink(),
      }))
      .sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });

    return {
      available: true,
      path: dirPath,
      items,
    };
  } catch (error) {
    console.error("FILEEXPLORER WINDOWS: failed to read directory:", error);

    return {
      available: false,
      error: "READ_DIR_ERROR",
    };
  }
}
