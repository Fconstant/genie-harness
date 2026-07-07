import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const SANDBOX_DIR = path.resolve(process.env.SANDBOX_DIR || "./sandbox");

function resolve(inputPath: string): string {
  const resolved = path.resolve(SANDBOX_DIR, inputPath);
  if (!resolved.startsWith(SANDBOX_DIR + path.sep) && resolved !== SANDBOX_DIR) {
    throw new Error(`Path escapes sandbox: ${inputPath}`);
  }
  return resolved;
}

export const read_file = createTool({
  id: "read_file",
  description: "Read contents of a file inside the sandbox directory. Returns the file content as a string.",
  inputSchema: z.object({
    path: z.string().describe("File path relative to sandbox root"),
  }),
  outputSchema: z.object({
    content: z.string(),
  }),
  execute: async ({ path: inputPath }) => {
    try {
      const resolved = resolve(inputPath);
      if (!existsSync(resolved)) return { content: `Error: file not found: ${inputPath}` };
      const content = readFileSync(resolved, "utf-8");
      return { content };
    } catch (err: any) {
      return { content: `Error: ${err.message}` };
    }
  },
});

export const write_file = createTool({
  id: "write_file",
  description: "Write string content to a file inside the sandbox directory. Creates or overwrites the file.",
  inputSchema: z.object({
    path: z.string().describe("File path relative to sandbox root"),
    content: z.string().describe("Text content to write to the file"),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ path: inputPath, content }) => {
    try {
      const resolved = resolve(inputPath);
      mkdirSync(path.dirname(resolved), { recursive: true });
      writeFileSync(resolved, content);
      return { result: `File written: ${inputPath}` };
    } catch (err: any) {
      return { result: `Error: ${err.message}` };
    }
  },
});

export const list_dir = createTool({
  id: "list_dir",
  description: "List files and directories inside a directory in the sandbox.",
  inputSchema: z.object({
    path: z.string().describe("Directory path relative to sandbox root. Use '.' for sandbox root."),
  }),
  outputSchema: z.object({
    entries: z.array(z.string()),
  }),
  execute: async ({ path: inputPath }) => {
    try {
      const resolved = resolve(inputPath);
      if (!existsSync(resolved)) return { entries: [`Error: directory not found: ${inputPath}`] };
      const entries = readdirSync(resolved);
      return { entries };
    } catch (err: any) {
      return { entries: [`Error: ${err.message}`] };
    }
  },
});

export const run_command = createTool({
  id: "run_command",
  description: "Execute a shell command inside the sandbox directory. Returns stdout, stderr, and exit code.",
  inputSchema: z.object({
    command: z.string().describe("Shell command to execute"),
  }),
  outputSchema: z.object({
    stdout: z.string(),
    stderr: z.string(),
    exitCode: z.number(),
  }),
  execute: async ({ command }) => {
    try {
      const result = execSync(command, {
        cwd: SANDBOX_DIR,
        timeout: 30000,
        encoding: "utf-8",
      });
      return { stdout: result, stderr: "", exitCode: 0 };
    } catch (err: any) {
      return {
        stdout: err.stdout?.toString() || "",
        stderr: err.stderr?.toString() || err.message,
        exitCode: err.status || 1,
      };
    }
  },
});

export const tools = {
  [read_file.id]: read_file,
  [write_file.id]: write_file,
  [list_dir.id]: list_dir,
  [run_command.id]: run_command,
};
