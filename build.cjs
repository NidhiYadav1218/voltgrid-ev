const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('🚀 [Build] Installing client dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

  console.log('⚡ [Build] Building Vite client...');
  execSync('npm run build', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

  console.log('📁 [Build] Mirroring client/dist to root dist...');
  const clientDist = path.join(__dirname, 'client', 'dist');
  const rootDist = path.join(__dirname, 'dist');
  fs.cpSync(clientDist, rootDist, { recursive: true, force: true });

  console.log('✅ [Build] Successfully generated build in both dist and client/dist!');
} catch (err) {
  console.error('❌ [Build] Failed:', err);
  process.exit(1);
}
