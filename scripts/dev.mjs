#!/usr/bin/env node
// Arranca API y frontend a la vez con un solo comando: `npm run dev`.
// Prefija cada línea con [back] o [front] y cierra ambos con Ctrl+C.
import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const services = [
  { name: "back", color: "\x1b[36m", args: ["run", "dev", "-w", "backend"] },
  { name: "front", color: "\x1b[35m", args: ["run", "dev", "-w", "frontend"] },
];

const RESET = "\x1b[0m";
const children = [];
let shuttingDown = false;

function prefixStream(stream, name, color) {
  let buffer = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      process.stdout.write(`${color}[${name}]${RESET} ${line}\n`);
    }
  });
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 300);
}

for (const service of services) {
  const child = spawn(npm, service.args, { stdio: ["ignore", "pipe", "pipe"] });
  children.push(child);
  prefixStream(child.stdout, service.name, service.color);
  prefixStream(child.stderr, service.name, service.color);

  child.on("error", (error) => {
    console.error(`[${service.name}] no se pudo iniciar: ${error.message}`);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(
      `[${service.name}] terminó (${signal ?? `código ${code}`}). Cerrando el resto...`,
    );
    shutdown(code ?? 1);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Levantando API y frontend... (Ctrl+C para detener ambos)\n");
