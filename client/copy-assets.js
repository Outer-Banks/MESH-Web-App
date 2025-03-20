/**
 * Script to copy assets from src/assets to public/images for GitHub Pages deployment
 */
const fs = require('fs');
const path = require('path');

// Directories
const srcAssetsDir = path.join(__dirname, 'src', 'assets');
const publicImagesDir = path.join(__dirname, 'public', 'images');
const publicPostsDir = path.join(publicImagesDir, 'posts');
const publicAvatarsDir = path.join(publicImagesDir, 'avatars');

// Create directories if they don't exist
const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

createDirIfNotExists(publicImagesDir);
createDirIfNotExists(publicPostsDir);
createDirIfNotExists(publicAvatarsDir);

// Copy files from src/assets to public/images
const copyFiles = (sourceDir, targetDir) => {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory does not exist: ${sourceDir}`);
    return;
  }

  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      createDirIfNotExists(targetPath);
      copyFiles(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  });
};

// Copy all assets
copyFiles(srcAssetsDir, publicImagesDir);

// Copy specific files to posts directory
const specificFiles = ['SIM_INC.jpg'];
specificFiles.forEach(file => {
  const sourcePath = path.join(srcAssetsDir, file);
  if (fs.existsSync(sourcePath)) {
    const targetPath = path.join(publicPostsDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied to posts: ${sourcePath} -> ${targetPath}`);
  } else {
    console.log(`File not found: ${sourcePath}`);
  }
});

console.log('Asset copying completed!');
