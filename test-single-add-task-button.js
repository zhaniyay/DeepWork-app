const fs = require('fs');
const path = require('path');

// Test single add task button functionality
function testSingleAddTaskButton() {
  console.log('🧪 Testing Single Add Task Button\n');
  
  let allTestsPassed = true;
  
  // Test 1: Check if FAB (Floating Action Button) exists
  console.log('Test 1: FAB Button Exists');
  
  const tasksPagePath = path.join(__dirname, 'app/(main)/tasks/index.tsx');
  if (fs.existsSync(tasksPagePath)) {
    const content = fs.readFileSync(tasksPagePath, 'utf8');
    
    if (content.includes('<FAB') && content.includes('Add Task')) {
      console.log('  ✅ FAB button exists with "Add Task" label');
    } else {
      console.log('  ❌ FAB button does not exist or missing label');
      allTestsPassed = false;
    }
    
    if (content.includes('icon="plus"') && content.includes('onPress={() => router.push(\'chat\')}')) {
      console.log('  ✅ FAB has proper icon and navigation');
    } else {
      console.log('  ❌ FAB does not have proper icon or navigation');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Tasks page file not found');
    allTestsPassed = false;
  }
  
  // Test 2: Check if duplicate button in empty state is removed
  console.log('\nTest 2: No Duplicate Button in Empty State');
  
  if (fs.existsSync(tasksPagePath)) {
    const content = fs.readFileSync(tasksPagePath, 'utf8');
    
    // Count occurrences of "Add Task" button
    const addTaskButtonMatches = content.match(/Add Task/g);
    const buttonMatches = content.match(/Button.*Add Task/g);
    
    if (addTaskButtonMatches && addTaskButtonMatches.length === 1) {
      console.log('  ✅ Only one "Add Task" text found');
    } else {
      console.log('  ❌ Multiple "Add Task" texts found');
      allTestsPassed = false;
    }
    
    if (!content.includes('emptyButton') && !content.includes('style={styles.emptyButton}')) {
      console.log('  ✅ Empty state button is removed');
    } else {
      console.log('  ❌ Empty state button still exists');
      allTestsPassed = false;
    }
  }
  
  // Test 3: Check if empty state still shows proper message
  console.log('\nTest 3: Empty State Message');
  
  if (fs.existsSync(tasksPagePath)) {
    const content = fs.readFileSync(tasksPagePath, 'utf8');
    
    if (content.includes('No tasks found') && content.includes('emptyState')) {
      console.log('  ✅ Empty state message is preserved');
    } else {
      console.log('  ❌ Empty state message is missing');
      allTestsPassed = false;
    }
    
    if (content.includes('Create your first task to get started')) {
      console.log('  ✅ Helpful empty state description is preserved');
    } else {
      console.log('  ❌ Empty state description is missing');
      allTestsPassed = false;
    }
  }
  
  // Test 4: Check if FAB styling is proper
  console.log('\nTest 4: FAB Styling');
  
  if (fs.existsSync(tasksPagePath)) {
    const content = fs.readFileSync(tasksPagePath, 'utf8');
    
    if (content.includes('position: \'absolute\'') && content.includes('bottom: 0')) {
      console.log('  ✅ FAB has proper positioning');
    } else {
      console.log('  ❌ FAB does not have proper positioning');
      allTestsPassed = false;
    }
    
    if (content.includes('backgroundColor: colors.primary[600]')) {
      console.log('  ✅ FAB has proper styling');
    } else {
      console.log('  ❌ FAB does not have proper styling');
      allTestsPassed = false;
    }
  }
  
  // Test 5: Check if unused styles are cleaned up
  console.log('\nTest 5: Clean Code');
  
  if (fs.existsSync(tasksPagePath)) {
    const content = fs.readFileSync(tasksPagePath, 'utf8');
    
    if (!content.includes('emptyButton: {')) {
      console.log('  ✅ Unused emptyButton style is removed');
    } else {
      console.log('  ❌ Unused emptyButton style still exists');
      allTestsPassed = false;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SINGLE ADD TASK BUTTON TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Only one "Add Task" button exists');
    console.log('✅ FAB button is properly positioned');
    console.log('✅ Empty state is clean without duplicate button');
    console.log('✅ Code is clean without unused styles');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Please fix the issues above before testing');
  }
  
  console.log('\n🔧 FIXES IMPLEMENTED:');
  console.log('- Removed duplicate "Add Task" button from empty state');
  console.log('- Kept only the FAB (Floating Action Button)');
  console.log('- Cleaned up unused emptyButton style');
  console.log('- Preserved empty state messages');
  
  console.log('\n🧪 EXPECTED BEHAVIOR:');
  console.log('1. Only one "Add Task" button (FAB) appears on screen');
  console.log('2. FAB is positioned at bottom-right corner');
  console.log('3. Empty state shows message without duplicate button');
  console.log('4. Clicking FAB navigates to chat to add task');
  console.log('5. Clean UI without redundant buttons');
  
  console.log('\n📋 USER EXPERIENCE:');
  console.log('1. User sees clean interface with single add button');
  console.log('2. FAB is always accessible regardless of filter');
  console.log('3. Empty state is informative but not cluttered');
  console.log('4. Consistent add task experience across all filters');
  
  return allTestsPassed;
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = testSingleAddTaskButton();
  process.exit(success ? 0 : 1);
}

module.exports = { testSingleAddTaskButton }; 