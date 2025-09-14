import { execSync } from 'child_process';

// Get the migration name from the arguments
const migrationName = process.argv[2];
console.log(migrationName);

if (!migrationName) {
  console.error('❌ Error: You must provide a migration name');
  console.log('📝 Usage: ts-node scripts/generate-migration.js MigrationName');
  console.log(
    '📝 Example: ts-node scripts/generate-migration.ts InitialSchema',
  );
  process.exit(1);
}

try {
  console.log(`🔄 Generating migration: ${migrationName}`);

  const command = `npx typeorm-ts-node-commonjs migration:generate src/database/migrations/${migrationName} -d src/config/data-source.ts`;

  console.log(`📋 Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });

  console.log(`✅ Migration successfully generated: ${migrationName}`);
  console.log(`📁 Location: src/database/migrations/`);
} catch (error) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.error('❌ Error generating migration:', error.message);
  process.exit(1);
}
