// scripts/fix-esm.js
const fs = require('fs').promises;
const path = require('path');

async function fixEsmExtensions() {
  const distEsmDir = path.join(__dirname, '..', 'dist-esm');
  const distDir = path.join(__dirname, '..', 'dist');
  
  try {
    // Copy ESM files to dist with .mjs extension
    const files = await fs.readdir(distEsmDir);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const sourcePath = path.join(distEsmDir, file);
        const targetPath = path.join(distDir, file.replace('.js', '.mjs'));
        await fs.copyFile(sourcePath, targetPath);
      }
    }
    
    // Clean up temporary ESM directory
    await fs.rm(distEsmDir, { recursive: true });
    
    console.log('✅ ESM build fixed successfully');
  } catch (error) {
    console.error('❌ Error fixing ESM build:', error);
    process.exit(1);
  }
}

fixEsmExtensions();