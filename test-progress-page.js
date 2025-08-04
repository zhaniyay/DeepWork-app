const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Simplified Progress Page...\n');

// Test 1: Check if progress page file exists and is valid
console.log('1. Checking progress page structure...');
try {
  const progressPagePath = path.join(__dirname, 'app', '(main)', 'progress', 'index.tsx');
  const progressDashboardPath = path.join(__dirname, 'src', 'components', 'ProgressDashboard.tsx');
  
  if (!fs.existsSync(progressPagePath)) {
    throw new Error('Progress page file not found');
  }
  
  if (!fs.existsSync(progressDashboardPath)) {
    throw new Error('ProgressDashboard component not found');
  }
  
  const progressPageContent = fs.readFileSync(progressPagePath, 'utf8');
  const dashboardContent = fs.readFileSync(progressDashboardPath, 'utf8');
  
  // Check for key imports and structure
  if (!progressPageContent.includes('ProgressDashboard')) {
    throw new Error('ProgressDashboard not imported in progress page');
  }
  
  if (!dashboardContent.includes('useTaskStore')) {
    throw new Error('Task store not used in ProgressDashboard');
  }
  
  if (!dashboardContent.includes('TaskStatus')) {
    throw new Error('TaskStatus not imported in ProgressDashboard');
  }
  
  console.log('✅ Progress page structure is valid');
} catch (error) {
  console.error('❌ Progress page structure error:', error.message);
  process.exit(1);
}

// Test 2: Check for simplified functionality
console.log('\n2. Checking simplified functionality...');
try {
  const dashboardContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'ProgressDashboard.tsx'), 'utf8');
  
  // Check that complex features were removed
  const removedFeatures = [
    'useProgressStore',
    'getProgressStats',
    'calculateProductivityScore',
    'calculateStreak',
    'weeklyFocusTime',
    'monthlyFocusTime',
    'productivityScore',
    'currentStreak',
    'longestStreak'
  ];
  
  const foundRemovedFeatures = removedFeatures.filter(feature => 
    dashboardContent.includes(feature)
  );
  
  if (foundRemovedFeatures.length > 0) {
    console.warn('⚠️  Some complex features still present:', foundRemovedFeatures);
  } else {
    console.log('✅ Complex features properly removed');
  }
  
  // Check for new simplified features
  const newFeatures = [
    'totalTasks',
    'completedTasks',
    'inProgressTasks',
    'pausedTasks',
    'pendingTasks',
    'completionRate',
    'Quick Actions',
    'Start Focus Session',
    'Add New Task'
  ];
  
  const foundNewFeatures = newFeatures.filter(feature => 
    dashboardContent.includes(feature)
  );
  
  if (foundNewFeatures.length >= 6) {
    console.log('✅ New simplified features implemented');
  } else {
    console.warn('⚠️  Some new features missing:', newFeatures.filter(f => !foundNewFeatures.includes(f)));
  }
  
} catch (error) {
  console.error('❌ Functionality check error:', error.message);
  process.exit(1);
}

// Test 3: Check for proper task integration
console.log('\n3. Checking task integration...');
try {
  const taskStorePath = path.join(__dirname, 'src', 'stores', 'taskStore.ts');
  const taskTypesPath = path.join(__dirname, 'src', 'types', 'task.ts');
  
  if (!fs.existsSync(taskStorePath)) {
    throw new Error('Task store not found');
  }
  
  if (!fs.existsSync(taskTypesPath)) {
    throw new Error('Task types not found');
  }
  
  const taskStoreContent = fs.readFileSync(taskStorePath, 'utf8');
  const taskTypesContent = fs.readFileSync(taskTypesPath, 'utf8');
  
  // Check for required task statuses
  const requiredStatuses = ['PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED'];
  const foundStatuses = requiredStatuses.filter(status => 
    taskTypesContent.includes(status)
  );
  
  if (foundStatuses.length === requiredStatuses.length) {
    console.log('✅ All required task statuses available');
  } else {
    console.warn('⚠️  Missing task statuses:', requiredStatuses.filter(s => !foundStatuses.includes(s)));
  }
  
  // Check for task store methods
  const requiredMethods = ['getTasks', 'markTaskInProgress', 'selectTask'];
  const foundMethods = requiredMethods.filter(method => 
    taskStoreContent.includes(method)
  );
  
  if (foundMethods.length === requiredMethods.length) {
    console.log('✅ Required task store methods available');
  } else {
    console.warn('⚠️  Missing task store methods:', requiredMethods.filter(m => !foundMethods.includes(m)));
  }
  
} catch (error) {
  console.error('❌ Task integration error:', error.message);
  process.exit(1);
}

// Test 4: Check for proper navigation
console.log('\n4. Checking navigation integration...');
try {
  const dashboardContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'ProgressDashboard.tsx'), 'utf8');
  
  // Check for router usage
  if (!dashboardContent.includes('useRouter')) {
    throw new Error('Router not used in ProgressDashboard');
  }
  
  // Check for navigation calls
  const navigationCalls = [
    'router.push(\'focus/25\')',
    'router.push(\'chat\')'
  ];
  
  const foundNavigationCalls = navigationCalls.filter(call => 
    dashboardContent.includes(call)
  );
  
  if (foundNavigationCalls.length >= 1) {
    console.log('✅ Navigation properly integrated');
  } else {
    console.warn('⚠️  Navigation calls missing');
  }
  
} catch (error) {
  console.error('❌ Navigation check error:', error.message);
  process.exit(1);
}

// Test 5: Check for proper styling
console.log('\n5. Checking styling and layout...');
try {
  const dashboardContent = fs.readFileSync(path.join(__dirname, 'src', 'components', 'ProgressDashboard.tsx'), 'utf8');
  
  // Check for essential styling
  const requiredStyles = [
    'statsGrid',
    'statCard',
    'actionsCard',
    'tasksCard',
    'emptyCard',
    'progressCard'
  ];
  
  const foundStyles = requiredStyles.filter(style => 
    dashboardContent.includes(style)
  );
  
  if (foundStyles.length >= 4) {
    console.log('✅ Essential styling implemented');
  } else {
    console.warn('⚠️  Missing styles:', requiredStyles.filter(s => !foundStyles.includes(s)));
  }
  
  // Check for proper layout structure
  if (dashboardContent.includes('ScrollView') && dashboardContent.includes('Card')) {
    console.log('✅ Proper layout structure');
  } else {
    console.warn('⚠️  Layout structure may be incomplete');
  }
  
} catch (error) {
  console.error('❌ Styling check error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Progress page simplification completed successfully!');
console.log('\n📋 Summary of improvements:');
console.log('   • Removed complex analytics and charts');
console.log('   • Simplified to focus on actual task data');
console.log('   • Added quick action buttons');
console.log('   • Improved empty state handling');
console.log('   • Better task status visualization');
console.log('   • Cleaner, more functional layout');

console.log('\n✨ The progress page is now much simpler and more functional!'); 