import { execSync } from 'child_process';

console.log('🔄 Running single migration...');

try {
  // Run the migration directly
  execSync(
    'npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts',
    {
      stdio: 'inherit',
    },
  );

  console.log('✅ Migration executed successfully');
} catch (error) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.error('❌ Error executing migration:', error.message);
  process.exit(1);
}
