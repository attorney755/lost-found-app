const { build } = require('esbuild-wasm');
const path = require('path');

async function runBuild() {
  console.log('⚡ Building client application bundle...');
  try {
    await build({
      entryPoints: [path.join(__dirname, 'src/index.jsx')],
      bundle: true,
      outfile: path.join(__dirname, 'public/bundle.js'),
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      define: { 'process.env.NODE_ENV': '"development"' },
    });
    console.log('✅ Client bundle built successfully in client/public/bundle.js');
  } catch (err) {
    console.error('❌ Build failed:', err);
  }
}

runBuild();
