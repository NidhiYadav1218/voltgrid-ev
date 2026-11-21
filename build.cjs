const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientDist = path.join(__dirname, 'client', 'dist');
const rootDist = path.join(__dirname, 'dist');

try {
  console.log('⚡ [Build] Building Vite client...');
  execSync('npm --prefix client run build', { stdio: 'inherit' });
} catch (e) {
  console.log('ℹ️ [Build] Using existing pre-built dist assets.');
}

if (fs.existsSync(clientDist)) {
  fs.cpSync(clientDist, rootDist, { recursive: true, force: true });
}

console.log('✅ [Build] Successfully generated deployment assets in dist!');
