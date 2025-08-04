const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Focus Session Duration Debug...\n');

// Test 1: Check if debug logging was added
console.log('1. Checking debug logging...');
try {
  const focusScreenPath = path.join(__dirname, 'app', '(main)', 'focus', '[duration].tsx');
  const focusSessionPath = path.join(__dirname, 'src', 'components', 'FocusSession.tsx');
  
  const focusScreenContent = fs.readFileSync(focusScreenPath, 'utf8');
  const focusSessionContent = fs.readFileSync(focusSessionPath, 'utf8');
  
  // Check for debug logging in focus screen
  if (focusScreenContent.includes('console.log(\'Focus Session Duration Debug:\'')) {
    console.log('✅ Debug logging added to focus screen');
  } else {
    console.warn('⚠️  Debug logging not found in focus screen');
  }
  
  // Check for debug logging in FocusSession component
  if (focusSessionContent.includes('console.log(\'FocusSession Debug:\'')) {
    console.log('✅ Debug logging added to FocusSession component');
  } else {
    console.warn('⚠️  Debug logging not found in FocusSession component');
  }
  
} catch (error) {
  console.error('❌ Debug logging check error:', error.message);
  process.exit(1);
}

// Test 2: Check if duration update logic was added
console.log('\n2. Checking duration update logic...');
try {
  const focusSessionPath = path.join(__dirname, 'src', 'components', 'FocusSession.tsx');
  const focusSessionContent = fs.readFileSync(focusSessionPath, 'utf8');
  
  // Check for duration update useEffect
  if (focusSessionContent.includes('useEffect(() => {') && 
      focusSessionContent.includes('setTimeRemaining(duration * 60)') &&
      focusSessionContent.includes('[duration]')) {
    console.log('✅ Duration update logic properly implemented');
  } else {
    console.warn('⚠️  Duration update logic may be missing');
  }
  
} catch (error) {
  console.error('❌ Duration update check error:', error.message);
  process.exit(1);
}

// Test 3: Check if progress calculation was fixed
console.log('\n3. Checking progress calculation fix...');
try {
  const focusSessionPath = path.join(__dirname, 'src', 'components', 'FocusSession.tsx');
  const focusSessionContent = fs.readFileSync(focusSessionPath, 'utf8');
  
  // Check for new progress calculation
  const newProgressLogic = [
    'totalSeconds = duration * 60',
    'elapsedSeconds = totalSeconds - timeRemaining',
    'progress = elapsedSeconds / totalSeconds'
  ];
  
  const foundProgressLogic = newProgressLogic.filter(logic => 
    focusSessionContent.includes(logic)
  );
  
  if (foundProgressLogic.length >= 2) {
    console.log('✅ Progress calculation properly fixed');
  } else {
    console.warn('⚠️  Progress calculation may not be fixed');
  }
  
  // Check that old progress calculation was removed
  if (!focusSessionContent.includes('progress = 1 - timeRemaining / (duration * 60)')) {
    console.log('✅ Old progress calculation removed');
  } else {
    console.warn('⚠️  Old progress calculation still present');
  }
  
} catch (error) {
  console.error('❌ Progress calculation check error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Focus session duration debug setup completed!');
console.log('\n📋 Next steps:');
console.log('   1. Start a focus session with a task that has estimated time');
console.log('   2. Check the console logs to see the debug information');
console.log('   3. Verify that the duration and progress are correct');
console.log('   4. The debug logs will show:');
console.log('      - Task estimated time');
console.log('      - URL duration parameter');
console.log('      - Final duration used');
console.log('      - Time remaining and progress calculation');

console.log('\n🔍 Debug information will help identify:');
console.log('   • If the task\'s estimated time is being read correctly');
console.log('   • If the duration is being passed to FocusSession properly');
console.log('   • If the progress calculation is working correctly');
console.log('   • If the timer is starting from the right duration'); 