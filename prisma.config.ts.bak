// Prisma config - reads DATABASE_URL from environment or .env files
import { defineConfig } from "prisma/config";

// Load env files in priority order (same as Next.js)
const envFiles = [".env.production.local", ".env.local", ".env"];
for (const file of envFiles) {
  try {
    const content = require("fs").readFileSync(file, "utf-8");
    content.split("\n").forEach((line: string) => {
      const match = line.match(/^([^#\s=]+)\s*=\s*(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    });
  } catch {
    // File doesn't exist, skip
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
