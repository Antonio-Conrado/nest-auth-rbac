const fs = require('fs');
const path = require('path');
const readline = require('readline');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function replaceInFile(filePath, oldName, newName) {
  try {
    const absPath = path.resolve(filePath);
    const content = await fs.promises.readFile(absPath, 'utf8');
    const updated = content.split(oldName).join(newName);
    await fs.promises.writeFile(absPath, updated, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  const packageJsonPath = path.resolve('package.json');
  const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const oldName = packageJson.name;

  const newName = await askQuestion(`Current project name is "${oldName}". Enter new project name: `);
  if (!newName) {
    console.log('No new name entered. Exiting.');
    process.exit(0);
  }

  // Change project name in package.json
  packageJson.name = newName;
  await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log(`package.json updated with new name: ${newName}`);

  // Change in README.md and package-lock.json
  const filesToUpdate = ['README.md', 'package-lock.json'];
  for (const file of filesToUpdate) {
    await replaceInFile(file, oldName, newName);
  }

  // Now ask for Swagger title
  const mainTsPath = path.resolve('src', 'main.ts');
  const mainTsContent = await fs.promises.readFile(mainTsPath, 'utf8');

  // Search for the old Swagger title (default 'Nest Auth RBAC')
  const swaggerTitleOld = 'Nest Auth RBAC';
  const swaggerTitleNew = await askQuestion(`Current Swagger title is "${swaggerTitleOld}". Enter new Swagger title: `);

  if (swaggerTitleNew) {
    const updatedMainTsContent = mainTsContent.split(swaggerTitleOld).join(swaggerTitleNew);
    await fs.promises.writeFile(mainTsPath, updatedMainTsContent, 'utf8');
    console.log(`Updated Swagger title in src/main.ts to "${swaggerTitleNew}"`);
  } else {
    console.log('No Swagger title entered. Skipping update.');
  }

  console.log('Project rename complete!');
}

main().catch(err => {
  console.error('Error running rename script:', err);
  process.exit(1);
});
