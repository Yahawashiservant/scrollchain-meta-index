const fs = require('fs');
const path = require('path');

function locatePackage(pkgName, startDir = process.cwd()) {
  const segments = pkgName.startsWith('@') ? pkgName.split('/') : [pkgName];
  let current = startDir;
  const { root } = path.parse(current);

  while (true) {
    const candidate = path.join(current, 'node_modules', ...segments, 'package.json');
    if (fs.existsSync(candidate)) {
      return true;
    }
    if (current === root) {
      break;
    }
    current = path.dirname(current);
  }

  return false;
}

function safeRequire(pkgName, startDir) {
  if (!pkgName) {
    return null;
  }

  const baseDir = startDir || __dirname;
  if (!locatePackage(pkgName, baseDir)) {
    return null;
  }

  return require(pkgName);
}

module.exports = {
  safeRequire,
  locatePackage
};
