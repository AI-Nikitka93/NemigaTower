import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const assetOutputDir = path.join(distDir, 'assets');
const packageJsonPath = path.join(rootDir, 'package.json');
const indexHtmlPath = path.join(rootDir, 'index.html');

function safeGit(command, fallback = 'unknown') {
  try {
    return execSync(command, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim() || fallback;
  } catch {
    return fallback;
  }
}

function collectReferencedAssets(html) {
  const matches = html.match(/assets\/[^"'()\s>]+/g) || [];
  return [...new Set(matches)].sort();
}

function ensureAssetExists(relativeAssetPath) {
  const absoluteAssetPath = path.join(rootDir, relativeAssetPath);
  if (!existsSync(absoluteAssetPath)) {
    throw new Error(`Referenced asset is missing: ${relativeAssetPath}`);
  }
  return absoluteAssetPath;
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const indexHtml = readFileSync(indexHtmlPath, 'utf8');
const referencedAssets = collectReferencedAssets(indexHtml);

rmSync(distDir, { recursive: true, force: true });
mkdirSync(assetOutputDir, { recursive: true });

writeFileSync(path.join(distDir, 'index.html'), indexHtml, 'utf8');
writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');

for (const assetPath of referencedAssets) {
  const sourcePath = ensureAssetExists(assetPath);
  const destinationPath = path.join(rootDir, 'dist', assetPath);
  mkdirSync(path.dirname(destinationPath), { recursive: true });
  cpSync(sourcePath, destinationPath, { force: true });
}

const metadata = {
  author: 'Nikita',
  nickname: 'AI_Nikitka93',
  version: packageJson.version,
  build_date_utc: new Date().toISOString(),
  git_sha: safeGit('git rev-parse HEAD')
};

writeFileSync(
  path.join(distDir, 'build_metadata.json'),
  JSON.stringify(metadata, null, 2),
  'utf8'
);

console.log(`Built dist with ${referencedAssets.length} referenced assets.`);
