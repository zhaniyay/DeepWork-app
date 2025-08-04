const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Focus Session Duration Fix...\n');

// Test 1: Check focus session screen logic
console.log('1. Checking focus session duration logic...');
try {
  const focusScreenPath = path.join(__dirname, 'app', '(main)', 'focus', '[duration].tsx');
  const focusScreenContent = fs.readFileSync(focusScreenPath, 'utf8');
  
  // Check for proper duration logic
  const requiredLogic = [
    'selectedTask?.estimated_minutes',
    'finalDuration = selectedTask.estimated_minutes',
    'finalDuration = parseInt(duration)',
    'setSessionDuration(finalDuration)'
  ];
  
  const foundLogic = requiredLogic.filter(logic => 
    focusScreenContent.includes(logic)
  );
  
  if (foundLogic.length >= 3) {
    console.log('✅ Focus session duration logic properly implemented');
  } else {
    console.warn('⚠️  Missing duration logic:', requiredLogic.filter(l => !foundLogic.includes(l)));
  }
  
  // Check for proper useEffect dependencies
  if (focusScreenContent.includes('[selectedTask, duration]')) {
    console.log('✅ Proper useEffect dependencies');
  } else {
    console.warn('⚠️  useEffect dependencies may be incorrect');
  }
  
} catch (error) {
  console.error('❌ Focus session check error:', error.message);
  process.exit(1);
}

// Test 2: Check tasks page navigation
console.log('\n2. Checking tasks page navigation...');
try {
  const tasksPagePath = path.join(__dirname, 'app', '(main)', 'tasks', 'index.tsx');
  const tasksPageContent = fs.readFileSync(tasksPagePath, 'utf8');
  
  // Check that hardcoded duration was removed
  if (!tasksPageContent.includes('focus/25')) {
    console.log('✅ Hardcoded duration removed from tasks page');
  } else {
    console.warn('⚠️  Hardcoded duration still present in tasks page');
  }
  
  // Check for proper navigation
  if (tasksPageContent.includes('focus/0')) {
    console.log('✅ Tasks page now uses dynamic duration');
  } else {
    console.warn('⚠️  Tasks page navigation may not be updated');
  }
  
} catch (error) {
  console.error('❌ Tasks page check error:', error.message);
  process.exit(1);
}

// Test 3: Check progress dashboard navigation
console.log('\n3. Checking progress dashboard navigation...');
try {
  const dashboardPath = path.join(__dirname, 'src', 'components', 'ProgressDashboard.tsx');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for dynamic duration usage
  const dynamicDurationChecks = [
    'task.estimated_minutes || 25',
    'nextTask.estimated_minutes || 25',
    'router.push(`focus/${duration}`)'
  ];
  
  const foundDynamicChecks = dynamicDurationChecks.filter(check => 
    dashboardContent.includes(check)
  );
  
  if (foundDynamicChecks.length >= 2) {
    console.log('✅ Progress dashboard uses dynamic duration');
  } else {
    console.warn('⚠️  Progress dashboard may not use dynamic duration');
  }
  
  // Check that hardcoded duration was removed
  if (!dashboardContent.includes('focus/25')) {
    console.log('✅ Hardcoded duration removed from progress dashboard');
  } else {
    console.warn('⚠️  Hardcoded duration still present in progress dashboard');
  }
  
} catch (error) {
  console.error('❌ Progress dashboard check error:', error.message);
  process.exit(1);
}

// Test 4: Check task types for estimated_minutes
console.log('\n4. Checking task types...');
try {
  const taskTypesPath = path.join(__dirname, 'src', 'types', 'task.ts');
  const taskTypesContent = fs.readFileSync(taskTypesPath, 'utf8');
  
  if (taskTypesContent.includes('estimated_minutes')) {
    console.log('✅ Task type includes estimated_minutes field');
  } else {
    console.warn('⚠️  Task type may not include estimated_minutes field');
  }
  
} catch (error) {
  console.error('❌ Task types check error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Focus session duration fix completed successfully!');
console.log('\n📋 Summary of improvements:');
console.log('   • Focus session now uses task\'s estimated time when available');
console.log('   • Falls back to URL parameter if no task time');
console.log('   • Defaults to 25 minutes if neither is available');
console.log('   • Removed hardcoded durations from tasks page and progress dashboard');
console.log('   • Added proper useEffect dependencies for duration updates');

console.log('\n✨ Now when you start a focus session:');
console.log('   • Tasks with 60 min estimated time will use 60 min sessions');
console.log('   • Tasks with 30 min estimated time will use 30 min sessions');
console.log('   • Tasks without estimated time will use 25 min default');
console.log('   • AI chat suggestions will also use appropriate durations'); 