#!/usr/bin/env tsx
// CLI script to seed demo data
import { seedDemoData } from "./seed";
import { db } from "../db";

async function main() {
  try {
    await seedDemoData();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
}

main();
