import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 3001;
const URL_FILE = join(process.cwd(), "data", "tunnel-url.txt");

function startTunnel() {
  console.log(`[Tunnel] Launching persistent SSH tunnel for port ${PORT}...`);

  const proc = spawn(
    "ssh",
    [
      "-p",
      "443",
      "-R",
      `0:localhost:${PORT}`,
      "-o",
      "StrictHostKeyChecking=accept-new",
      "-o",
      "ServerAliveInterval=10",
      "-o",
      "ServerAliveCountMax=6",
      "-o",
      "TCPKeepAlive=yes",
      "a.pinggy.io",
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    }
  );

  let buffer = "";

  const handleOutput = (data) => {
    const text = data.toString();
    buffer += text;
    process.stdout.write(text);

    // Look for HTTPS pinggy URL
    const match = buffer.match(/https:\/\/[a-zA-Z0-9-]+\.(?:run\.pinggy-free\.link|free\.pinggy\.net)/g);
    if (match && match.length > 0) {
      const activeUrl = match[0];
      try {
        writeFileSync(URL_FILE, activeUrl, "utf-8");
        console.log(`\n========================================\n[LIVE PREVIEW URL]: ${activeUrl}\n========================================\n`);
      } catch (e) {}
    }
  };

  proc.stdout.on("data", handleOutput);
  proc.stderr.on("data", handleOutput);

  proc.on("close", (code) => {
    console.log(`[Tunnel] Process exited with code ${code}. Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });

  proc.on("error", (err) => {
    console.error("[Tunnel] Error:", err.message);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
