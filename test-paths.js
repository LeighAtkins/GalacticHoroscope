// Simple test script to check if all paths in docs folder are relative (not starting with /)
const fs = require('fs');
const path = require('path');

// Function to recursively find files
function findFiles(dir, pattern, callback) {
  const results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return callback(err);
    
    let pending = list.length;
    if (!pending) return callback(null, results);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      
      fs.stat(filePath, (err, stat) => {
        if (err) return callback(err);
        
        if (stat && stat.isDirectory()) {
          findFiles(filePath, pattern, (err, res) => {
            if (err) return callback(err);
            
            results.push(...res);
            if (!--pending) callback(null, results);
          });
        } else {
          if (pattern.test(file)) {
            results.push(filePath);
          }
          if (!--pending) callback(null, results);
        }
      });
    });
  });
}

// Search pattern for HTML and JS files
const filePattern = /\.(html|js)$/;
// Pattern to match problematic paths (absolute paths starting with /)
const problemPattern = /(src|href|url|fetch|import)\s*=\s*["']\s*\/(?!\/)/g;
// Exclude patterns (false positives)
const excludePatterns = [
  /\/\//, // Double slashes like in https://
  /http:\/\//, // HTTP URLs
  /https:\/\//, // HTTPS URLs
  /\/\*/, // Comment start
  /\*\//, // Comment end
  /\/\/\s/ // JavaScript single-line comments
];

// Find all HTML and JS files
findFiles('docs', filePattern, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    return;
  }
  
  console.log(`Found ${files.length} HTML and JS files to check.`);
  
  // Check each file for problematic paths
  let problemFound = false;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(problemPattern);
    
    if (matches) {
      // Filter out false positives
      const realProblems = matches.filter(match => {
        return !excludePatterns.some(pattern => pattern.test(match));
      });
      
      if (realProblems.length > 0) {
        console.log(`⚠️ Found ${realProblems.length} problematic paths in ${file}:`);
        realProblems.forEach(problem => console.log(`   - ${problem}`));
        problemFound = true;
      }
    }
  });
  
  if (!problemFound) {
    console.log('✅ No problematic paths found! All resources should load correctly.');
  } else {
    console.log('⚠️ Some problematic paths were found. These may cause 404 errors.');
  }
}); 