/**
 * Standalone migration runner script
 *
 * This script can be run independently to apply database migrations.
 * Usage: ts-node -r tsconfig-paths/register src/migrations/run-migrations.ts
 */

import { runDatabaseMigrations } from './migration-runner';

async function main() {
  try {
    console.log('Starting database migration process...\n');
    await runDatabaseMigrations();
    console.log('Migration process completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('Migration process failed:', error.message);
    process.exit(1);
  }
}

main();
