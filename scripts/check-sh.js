#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = process.cwd();

const skipDirNames = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  'out',
  'tmp',
  'artifacts',
  'artifacts_tmp',
  'coverage',
  'docs',
  'public',
  'releases',
  'forks',
  'tests/generated',
]);

const args = process.argv.slice(2);
const runMode = args.includes('--run');
const confirmRun = args.includes('--yes');
const continueOnError = args.includes('--continue-on-error');
const filters = args
  .filter((arg) => arg.startsWith('--filter='))
  .map((arg) => arg.replace('--filter=', '').trim())
  .filter(Boolean);
const excludeFilters = args
  .filter((arg) => arg.startsWith('--exclude='))
  .map((arg) => arg.replace('--exclude=', '').trim())
  .filter(Boolean);

if (runMode && !confirmRun) {
  console.error(
    '\nRefusing to execute every shell script without explicit opt-in. '
      + 'Re-run with --run --yes if you understand the risks.'
  );
  process.exit(2);
}

function matchesFilters(filePath) {
  if (filters.length > 0 && !filters.some((filter) => filePath.includes(filter))) {
    return false;
  }
  if (excludeFilters.length > 0 && excludeFilters.some((filter) => filePath.includes(filter))) {
    return false;
  }
  return true;
}

function walk(directory, results) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      continue; // avoid following symlinks to keep traversal predictable
    }
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (skipDirNames.has(entry.name)) {
        continue;
      }
      walk(absolutePath, results);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.sh')) {
      const relativePath = path.relative(projectRoot, absolutePath);
      if (matchesFilters(relativePath)) {
        results.push({ absolutePath, relativePath });
      }
    }
  }
}

const discoveredScripts = [];
walk(projectRoot, discoveredScripts);

if (discoveredScripts.length === 0) {
  console.log('No shell scripts were found in this repository.');
  process.exit(0);
}

console.log(`Discovered ${discoveredScripts.length} shell script(s).`);

const failures = [];

for (const { absolutePath, relativePath } of discoveredScripts) {
  const command = runMode ? ['bash', [absolutePath]] : ['bash', ['-n', absolutePath]];
  const [binary, params] = command;
  console.log(`\n$ ${binary} ${params.join(' ')}\n# ${relativePath}`);
  const result = spawnSync(binary, params, {
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      CHECK_SH_RUN_MODE: runMode ? 'execute' : 'lint',
    },
  });

  if (result.status !== 0) {
    failures.push(relativePath);
    console.error(`\n✖ ${relativePath} exited with status ${result.status}`);
    if (!continueOnError) {
      console.error('\nStopping at first failure. Re-run with --continue-on-error to inspect all scripts.');
      break;
    }
  }
}

if (failures.length > 0) {
  console.error(`\nEncountered ${failures.length} failing shell script(s).`);
  failures.forEach((file) => console.error(` - ${file}`));
  process.exit(1);
}

console.log('\nAll shell scripts completed successfully.');
process.exit(0);
