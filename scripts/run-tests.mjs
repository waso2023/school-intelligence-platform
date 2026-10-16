import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const testDir = join(process.cwd(), "test");
const testFiles = readdirSync(testDir)
  .filter((f) => f.endsWith(".test.ts"))
  .map((f) => join(testDir, f));

console.log(`Discovered ${testFiles.length} test files:`, testFiles.map((f) => f.split(/[\\/]/).pop()));

const result = spawnSync("npx", ["tsx", "--test", ...testFiles], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status || 0);
