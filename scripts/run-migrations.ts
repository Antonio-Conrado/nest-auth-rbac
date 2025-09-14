import { execSync } from 'child_process';

try {
  console.log('🔄 Running migrations...');

  const command =
    'npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts';

  console.log(`📋 Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });

  console.log('✅ Migrations executed successfully');
} catch (error) {
  console.error(
    '❌ Error executing migrations:',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.message,
  );
  process.exit(1);
}
