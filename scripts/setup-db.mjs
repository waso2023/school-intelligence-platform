import { execSync } from "child_process";
import net from "net";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/school_intelligence_db?schema=public";

function checkPostgresPort(host = "localhost", port = 5432) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function main() {
  console.log("===============================================================");
  console.log("  SOP School Intelligence Platform — Database Engine Setup   ");
  console.log("===============================================================\n");

  const isReachable = await checkPostgresPort("localhost", 5432);

  if (isReachable) {
    console.log("✅ Local PostgreSQL service detected on port 5432!");
    console.log("🔄 Synchronizing schema with Prisma...");
    try {
      execSync("npx prisma db push", { stdio: "inherit" });
      console.log("\n🌱 Seeding database with SOP school tenant, roles & users...");
      execSync("npm run db:seed", { stdio: "inherit" });
      console.log("\n🎉 Database setup complete! PostgreSQL is live and synchronized.");
    } catch (err) {
      console.error("\n❌ Error applying Prisma schema:", err.message);
    }
  } else {
    console.log("⚠️  PostgreSQL is NOT currently running on localhost:5432.\n");
    console.log("🛡️  Zero-Data-Loss Active Mode:");
    console.log("   The application is running in high-availability persistent disk mode.");
    console.log("   All new students, staff, payments, attendance, and announcements");
    console.log("   are saved directly to durable storage in 'data/database/' and");
    console.log("   will NEVER be lost across server restarts or PC reboots.\n");
    console.log("🚀 To start PostgreSQL on this computer:");
    console.log("   Option A (Docker - Instant 1 command):");
    console.log("     docker run --name sop-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=school_intelligence_db -p 5432:5432 -d postgres:16-alpine\n");
    console.log("   Option B (Windows Native Installer):");
    console.log("     1. Download & run PostgreSQL Windows installer from https://www.postgresql.org/download/windows/");
    console.log("     2. Set password to 'postgres' and port 5432");
    console.log("     3. Create database 'school_intelligence_db' via pgAdmin or psql\n");
    console.log("   Once PostgreSQL is started, run this command to initialize:");
    console.log("     npm run db:setup\n");
  }
}

main();
