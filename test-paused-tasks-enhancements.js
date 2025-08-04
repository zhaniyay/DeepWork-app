const fs = require('fs');
const path = require('path');

// Test paused tasks enhancements
function testPausedTasksEnhancements() {
  console.log('🧪 Testing Paused Tasks Enhancements\n');
  
  let allTestsPassed = true;
  
  // Test 1: Check if visible resume button is added to paused task cards
  console.log('Test 1: Visible Resume Button on Paused Task Cards');
  
  const taskListPath = path.join(__dirname, 'src/components/TaskList.tsx');
  if (fs.existsSync(taskListPath)) {
    const content = fs.readFileSync(taskListPath, 'utf8');
    
    if (content.includes('task.status === TaskStatus.PAUSED') && content.includes('Resume Task')) {
      console.log('  ✅ Resume button is added to paused task cards');
    } else {
      console.log('  ❌ Resume button is not added to paused task cards');
      allTestsPassed = false;
    }
    
    if (content.includes('resumeButton') && content.includes('backgroundColor: colors.warning.primary')) {
      console.log('  ✅ Resume button has proper styling');
    } else {
      console.log('  ❌ Resume button does not have proper styling');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ TaskList file not found');
    allTestsPassed = false;
  }
  
  // Test 2: Check if paused badge is clickable
  console.log('\nTest 2: Clickable Paused Badge');
  
  if (fs.existsSync(taskListPath)) {
    const content = fs.readFileSync(taskListPath, 'utf8');
    
    if (content.includes('onPress={task.status === TaskStatus.PAUSED') && content.includes('handleTaskAction(task.id, \'resume\')')) {
      console.log('  ✅ Paused badge is clickable');
    } else {
      console.log('  ❌ Paused badge is not clickable');
      allTestsPassed = false;
    }
  }
  
  // Test 3: Check if Toast component is created
  console.log('\nTest 3: Toast Component');
  
  const toastPath = path.join(__dirname, 'src/components/Toast.tsx');
  if (fs.existsSync(toastPath)) {
    const content = fs.readFileSync(toastPath, 'utf8');
    
    if (content.includes('ToastProps') && content.includes('action?:') && content.includes('Resume')) {
      console.log('  ✅ Toast component is created with action support');
    } else {
      console.log('  ❌ Toast component is not properly created');
      allTestsPassed = false;
    }
    
    if (content.includes('Animated.View') && content.includes('slideAnim')) {
      console.log('  ✅ Toast has proper animations');
    } else {
      console.log('  ❌ Toast does not have proper animations');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Toast component file not found');
    allTestsPassed = false;
  }
  
  // Test 4: Check if Toast is integrated in TaskList
  console.log('\nTest 4: Toast Integration in TaskList');
  
  if (fs.existsSync(taskListPath)) {
    const content = fs.readFileSync(taskListPath, 'utf8');
    
    if (content.includes('import { Toast }') && content.includes('<Toast') && content.includes('toastVisible')) {
      console.log('  ✅ Toast is integrated in TaskList');
    } else {
      console.log('  ❌ Toast is not integrated in TaskList');
      allTestsPassed = false;
    }
    
    if (content.includes('showPauseToast') && content.includes('setToastVisible')) {
      console.log('  ✅ Toast state management is implemented');
    } else {
      console.log('  ❌ Toast state management is not implemented');
      allTestsPassed = false;
    }
  }
  
  // Test 5: Check if AppLaunchBanner component is created
  console.log('\nTest 5: App Launch Banner Component');
  
  const bannerPath = path.join(__dirname, 'src/components/AppLaunchBanner.tsx');
  if (fs.existsSync(bannerPath)) {
    const content = fs.readFileSync(bannerPath, 'utf8');
    
    if (content.includes('AppLaunchBannerProps') && content.includes('You paused') && content.includes('Resume?')) {
      console.log('  ✅ AppLaunchBanner component is created');
    } else {
      console.log('  ❌ AppLaunchBanner component is not properly created');
      allTestsPassed = false;
    }
    
    if (content.includes('twentyFourHoursAgo') && content.includes('TaskStatus.PAUSED')) {
      console.log('  ✅ Banner finds recently paused tasks');
    } else {
      console.log('  ❌ Banner does not find recently paused tasks');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ AppLaunchBanner component file not found');
    allTestsPassed = false;
  }
  
  // Test 6: Check if AppLaunchBanner is integrated in main layout
  console.log('\nTest 6: App Launch Banner Integration');
  
  const layoutPath = path.join(__dirname, 'app/_layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    if (content.includes('import { AppLaunchBanner }') && content.includes('<AppLaunchBanner')) {
      console.log('  ✅ AppLaunchBanner is integrated in main layout');
    } else {
      console.log('  ❌ AppLaunchBanner is not integrated in main layout');
      allTestsPassed = false;
    }
    
    if (content.includes('handleResumeTask') && content.includes('handleDismissBanner')) {
      console.log('  ✅ Banner handlers are implemented');
    } else {
      console.log('  ❌ Banner handlers are not implemented');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Main layout file not found');
    allTestsPassed = false;
  }
  
  // Test 7: Check if focus session shows toast on pause
  console.log('\nTest 7: Focus Session Toast on Pause');
  
  const focusSessionPath = path.join(__dirname, 'app/(main)/focus/[duration].tsx');
  if (fs.existsSync(focusSessionPath)) {
    const content = fs.readFileSync(focusSessionPath, 'utf8');
    
    if (content.includes('Toast: Task paused. [Resume]')) {
      console.log('  ✅ Focus session logs toast on pause');
    } else {
      console.log('  ❌ Focus session does not log toast on pause');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Focus session file not found');
    allTestsPassed = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PAUSED TASKS ENHANCEMENTS TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ All paused tasks enhancements are implemented');
    console.log('✅ Resume buttons are visible on paused task cards');
    console.log('✅ Paused badges are clickable');
    console.log('✅ Toast notifications are implemented');
    console.log('✅ App launch banner is created and integrated');
    console.log('✅ Focus session shows pause notifications');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Please fix the issues above before testing');
  }
  
  console.log('\n🔧 FEATURES IMPLEMENTED:');
  console.log('- Added visible resume button to paused task cards');
  console.log('- Made paused badge clickable');
  console.log('- Created Toast component with action support');
  console.log('- Integrated toast in TaskList');
  console.log('- Created AppLaunchBanner component');
  console.log('- Integrated banner in main layout');
  console.log('- Added pause notifications in focus session');
  
  console.log('\n🧪 EXPECTED BEHAVIOR:');
  console.log('1. Paused task cards show "Resume Task" button');
  console.log('2. Clicking "Paused" badge resumes the task');
  console.log('3. Toast shows "Task paused. [Resume]" on pause');
  console.log('4. App launch shows banner for recently paused tasks');
  console.log('5. All resume actions work consistently');
  console.log('6. State transitions are persisted and reflected in UI');
  
  console.log('\n📋 USER EXPERIENCE:');
  console.log('1. Clear visual cues for resuming paused tasks');
  console.log('2. Multiple ways to resume (button, badge, toast, banner)');
  console.log('3. Non-blocking notifications and banners');
  console.log('4. Consistent behavior across all resume actions');
  console.log('5. Proper state management and persistence');
  
  return allTestsPassed;
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = testPausedTasksEnhancements();
  process.exit(success ? 0 : 1);
}

module.exports = { testPausedTasksEnhancements }; 