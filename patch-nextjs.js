const fs = require('fs');
const path = require('path');

// Find the Next.js server files that might use new URL with Railway domains
const nextDir = path.join(__dirname, 'node_modules', 'next', 'dist');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Patch: wrap new URL calls that might receive invalid URLs
  // Look for patterns like new URL(e,t) or new URL(n,r)
  content = content.replace(
    /new URL\(([a-zA-Z_$][a-zA-Z0-9_$]*),([a-zA-Z_$][a-zA-Z0-9_$]*)\)/g,
    '(function(u,b){if(typeof b==="string"&&b&&!b.startsWith("http")&&!b.startsWith("file"))b="https://"+b;if(typeof u==="string"&&u&&!u.startsWith("http")&&!u.startsWith("/")&&!u.startsWith("file")&&!u.startsWith("data:")){if(u.includes(".")&&!u.includes(" "))u="https://"+u}return new URL(u,b)})($1,$2)'
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('[PATCH] Patched:', filePath);
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.js')) {
      callback(fullPath);
    }
  }
}

let patched = 0;
walkDir(nextDir, (filePath) => {
  if (patchFile(filePath)) {
    patched++;
  }
});

console.log(`[PATCH] Total files patched: ${patched}`);
