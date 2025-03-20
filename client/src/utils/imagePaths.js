/**
 * Utility to handle image paths for both local development and production (GitHub Pages)
 */

// Get the public URL from the environment or use the homepage from package.json
const getPublicUrl = () => {
  return process.env.PUBLIC_URL || '';
};

/**
 * Convert a relative image path to an absolute path that works in both development and production
 * @param {string} relativePath - The relative path to the image (e.g., '/images/posts/image.jpg')
 * @returns {string} - The absolute path to the image
 */
export const getImagePath = (relativePath) => {
  if (!relativePath) return null;
  
  // If the path is already an absolute URL or imported directly, return it as is
  if (relativePath.startsWith('http') || relativePath.startsWith('data:') || typeof relativePath !== 'string') {
    return relativePath;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // Combine the public URL with the relative path
  return `${getPublicUrl()}/${cleanPath}`;
};

export default getImagePath;
