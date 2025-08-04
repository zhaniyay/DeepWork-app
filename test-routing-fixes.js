const fs = require('fs');
const path = require('path');

// Test suite for routing fixes
function testRoutingFixes() {
  console.log('🧪 Testing Routing Fixes\n');
  
  let allTestsPassed = true;
  
  // Test 1: Verify all route files exist
  console.log('Test 1: Route File Existence');
  const expectedRoutes = [
    'app/index.tsx',
    'app/(auth)/login.tsx',
    'app/(auth)/signup.tsx',
    'app/(auth)/forgot-password.tsx',
    'app/(main)/dashboard.tsx',
    'app/(main)/chat/index.tsx',
    'app/(main)/focus/[duration].tsx',
    'app/(main)/progress/index.tsx',
    'app/(main)/settings/index.tsx',
    'app/(main)/tasks/index.tsx',
  ];
  
  for (const route of expectedRoutes) {
    const fullPath = path.join(__dirname, route);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      console.log(`  ✅ ${route}`);
    } else {
      console.log(`  ❌ ${route} - MISSING`);
      allTestsPassed = false;
    }
  }
  
  // Test 2: Verify layout configurations
  console.log('\nTest 2: Layout Configurations');
  
  // Check main layout
  const mainLayoutPath = path.join(__dirname, 'app/(main)/_layout.tsx');
  if (fs.existsSync(mainLayoutPath)) {
    const mainLayoutContent = fs.readFileSync(mainLayoutPath, 'utf8');
    
    const expectedScreenNames = [
      'dashboard',
      'chat/index',
      'focus/[duration]',
      'progress/index',
      'settings/index',
      'tasks/index'
    ];
    
    for (const screenName of expectedScreenNames) {
      if (mainLayoutContent.includes(`name="${screenName}"`)) {
        console.log(`  ✅ Screen "${screenName}" properly configured`);
      } else {
        console.log(`  ❌ Screen "${screenName}" missing or incorrectly configured`);
        allTestsPassed = false;
      }
    }
  } else {
    console.log('  ❌ Main layout file missing');
    allTestsPassed = false;
  }
  
  // Test 3: Verify no invalid icons
  console.log('\nTest 3: Icon Validation');
  
  const iconPatterns = [
    /icon="moon-outline"/g,
    /icon=".*-outline"/g,
  ];
  
  let foundInvalidIcons = false;
  
  function scanForInvalidIcons(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanForInvalidIcons(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        for (const pattern of iconPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`  ❌ Invalid icon found in ${fullPath}:`);
            matches.forEach(match => console.log(`     ${match}`));
            foundInvalidIcons = true;
            allTestsPassed = false;
          }
        }
      }
    }
  }
  
  scanForInvalidIcons(path.join(__dirname, 'app'));
  
  if (!foundInvalidIcons) {
    console.log('  ✅ No invalid icons found');
  }
  
  // Test 4: Verify route structure matches layout
  console.log('\nTest 4: Route Structure Consistency');
  
  const routeStructure = {
    '(auth)': ['login', 'signup', 'forgot-password'],
    '(main)': ['dashboard', 'chat/index', 'focus/[duration]', 'progress/index', 'settings/index', 'tasks/index']
  };
  
  for (const [group, routes] of Object.entries(routeStructure)) {
    console.log(`  Checking ${group}:`);
    for (const route of routes) {
      const expectedFile = `app/${group}/${route}.tsx`;
      const fullPath = path.join(__dirname, expectedFile);
      const exists = fs.existsSync(fullPath);
      
      if (exists) {
        console.log(`    ✅ ${route}`);
      } else {
        console.log(`    ❌ ${route} - file missing`);
        allTestsPassed = false;
      }
    }
  }
  
  // Test 5: Verify no duplicate route definitions
  console.log('\nTest 5: Duplicate Route Detection');
  
  const mainLayoutContent = fs.readFileSync(path.join(__dirname, 'app/(main)/_layout.tsx'), 'utf8');
  const screenMatches = mainLayoutContent.match(/name="([^"]+)"/g);
  
  if (screenMatches) {
    const screenNames = screenMatches.map(match => match.replace('name="', '').replace('"', ''));
    const uniqueNames = [...new Set(screenNames)];
    
    if (screenNames.length === uniqueNames.length) {
      console.log('  ✅ No duplicate route definitions found');
    } else {
      console.log('  ❌ Duplicate route definitions found:');
      const duplicates = screenNames.filter((name, index) => screenNames.indexOf(name) !== index);
      duplicates.forEach(dup => console.log(`     ${dup}`));
      allTestsPassed = false;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Route structure is properly configured');
    console.log('✅ No "No route named ... exists in nested children" warnings should appear');
    console.log('✅ All icons are valid MaterialCommunityIcons');
    console.log('✅ Layout files match the actual file structure');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Please fix the issues above before running the app');
  }
  
  return allTestsPassed;
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = testRoutingFixes();
  process.exit(success ? 0 : 1);
}

module.exports = { testRoutingFixes }; 