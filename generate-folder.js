// Generate folder structure

import fs from 'fs';
import path from 'path';

function generateCleanArchitecture(projectDir) {
  // Create root directory
  fs.mkdirSync(`src/pages/${projectDir}`, { recursive: true });

  // Create subdirectories
  const directories = ['controller', 'page', 'components'];

  for (const directory of directories) {
    const fullPath = path.join(`src/pages/${projectDir}`, directory);
    fs.mkdirSync(fullPath, { recursive: true });
  }

  ////////////////////////////////////////////
  const fileName = projectDir.charAt(0).toUpperCase() + projectDir.slice(1);
  ////////////////////////////////////////////
  // Page
  ////////////////////////////////////////////
  const pageContent = `const ${fileName}Page = () => {
  return <div>${fileName}Page</div>
}

export default ${fileName}Page`;

  const page = path.join(`src/pages/${projectDir}`, `index.tsx`);
  fs.writeFileSync(page, pageContent);

  console.log('Clean Architecture project structure created successfully!');
}

function main() {
  const commandLineArgs = process.argv.slice(2);
  if (commandLineArgs.length !== 1) {
    console.log('Usage: node generate_clean_architecture.js <project_dir>');
    process.exit(1);
  }

  const projectDir = commandLineArgs[0];
  generateCleanArchitecture(projectDir);
}

main();
