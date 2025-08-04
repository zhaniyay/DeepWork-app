const fs = require('fs');
const path = require('path');

// Define the expected route structure
const expectedRoutes = {
  'app/index.tsx': true,
  'app/(auth)/login.tsx': true,
  'app/(auth)/signup.tsx': true,
  'app/(auth)/forgot-password.tsx': true,
  'app/(main)/dashboard.tsx': true,
  'app/(main)/chat/index.tsx': true,
  'app/(main)/focus/[duration].tsx': true,
  'app/(main)/progress/index.tsx': true,
  'app/(main)/settings/index.tsx': true,
  'app/(main)/tasks/index.tsx': true,
};

// Routes defined in layout files
const layoutRoutes = {
  '(auth)': ['login', 'signup', 'forgot-password'],
  '(main)': ['dashboard', 'chat/index', 'focus/[duration]', 'progress/index', 'settings/index', 'tasks/index'],
};

function checkRoutes() {
  console.log('🔍 Verifying route structure...\n');
  
  let allValid = true;
  
  // Check if all expected files exist
  for (const [route, shouldExist] of Object.entries(expectedRoutes)) {
    const fullPath = path.join(__dirname, route);
    const exists = fs.existsSync(fullPath);
    
    if (shouldExist && !exists) {
      console.log(`❌ Missing route file: ${route}`);
      allValid = false;
    } else if (!shouldExist && exists) {
      console.log(`⚠️  Unexpected route file: ${route}`);
    } else if (shouldExist && exists) {
      console.log(`✅ Route exists: ${route}`);
    }
  }
  
  console.log('\n📋 Layout route definitions:');
  
  // Check layout route definitions
  for (const [group, routes] of Object.entries(layoutRoutes)) {
    console.log(`\n${group}:`);
    for (const route of routes) {
      const expectedFile = `app/${group}/${route}.tsx`;
      const fullPath = path.join(__dirname, expectedFile);
      const exists = fs.existsSync(fullPath);
      
      if (exists) {
        console.log(`  ✅ ${route}`);
      } else {
        console.log(`  ❌ ${route} (file not found)`);
        allValid = false;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allValid) {
    console.log('🎉 All routes are properly configured!');
    console.log('✅ No "No route named ... exists in nested children" warnings should appear.');
  } else {
    console.log('❌ Route configuration issues found.');
    console.log('Please fix the missing files or update the layout configurations.');
  }
  
  return allValid;
}

// Check for icon usage that might cause warnings
function checkIcons() {
  console.log('\n🔍 Checking for potentially invalid icons...\n');
  
  const iconPatterns = [
    /icon="moon-outline"/g,
    /icon=".*-outline"/g,
  ];
  
  let foundIssues = false;
  
  function scanFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const pattern of iconPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`⚠️  Potentially invalid icon in ${filePath}:`);
        matches.forEach(match => console.log(`   ${match}`));
        foundIssues = true;
      }
    }
  }
  
  // Scan all TypeScript/TSX files
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        scanFile(fullPath);
      }
    }
  }
  
  scanDirectory(path.join(__dirname, 'app'));
  
  if (!foundIssues) {
    console.log('✅ No potentially invalid icons found.');
  }
}

// Run the verification
if (require.main === module) {
  const routesValid = checkRoutes();
  checkIcons();
  
  if (!routesValid) {
    process.exit(1);
  }
}

module.exports = { checkRoutes, checkIcons }; 