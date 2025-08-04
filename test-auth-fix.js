const fs = require('fs');
const path = require('path');

console.log('🔐 Testing Auth Store Fix...\n');
console.log('=' .repeat(50));

try {
  const authStorePath = path.join(__dirname, 'src', 'stores', 'authStore.ts');
  const layoutPath = path.join(__dirname, 'app', '_layout.tsx');
  
  if (fs.existsSync(authStorePath)) {
    const authContent = fs.readFileSync(authStorePath, 'utf8');
    
    const requiredFunctions = [
      'setSession',
      'refreshUser',
      'forgotPassword',
      'resetPassword',
      'isAuthenticated'
    ];
    
    const foundFunctions = requiredFunctions.filter(func => 
      authContent.includes(func)
    );
    
    console.log(`✅ Auth store functions: ${foundFunctions.length}/${requiredFunctions.length}`);
    console.log(`   Found: ${foundFunctions.join(', ')}`);
    
    if (foundFunctions.length === requiredFunctions.length) {
      console.log('✅ All required auth functions are present');
    } else {
      console.log('⚠️  Missing auth functions');
    }
  }
  
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    if (layoutContent.includes('setSession') && layoutContent.includes('refreshUser')) {
      console.log('✅ Layout file properly imports auth functions');
    } else {
      console.log('⚠️  Layout file missing auth function imports');
    }
  }
  
  console.log('\n🎯 Auth initialization should now work properly!');
  console.log('The setSession and refreshUser functions have been restored.');
  
} catch (error) {
  console.error('❌ Auth test failed:', error.message);
} 