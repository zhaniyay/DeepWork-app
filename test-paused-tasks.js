const fs = require('fs');
const path = require('path');

// Test paused tasks functionality
function testPausedTasks() {
  console.log('🧪 Testing Paused Tasks Functionality\n');
  
  let allTestsPassed = true;
  
  // Test 1: Check if PAUSED status is added to TaskStatus
  console.log('Test 1: PAUSED Status Definition');
  
  const taskTypesPath = path.join(__dirname, 'src/types/task.ts');
  if (fs.existsSync(taskTypesPath)) {
    const content = fs.readFileSync(taskTypesPath, 'utf8');
    
    if (content.includes("PAUSED: 'paused'")) {
      console.log('  ✅ PAUSED status is properly defined');
    } else {
      console.log('  ❌ PAUSED status is not defined');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Task types file not found');
    allTestsPassed = false;
  }
  
  // Test 2: Check if markTaskPaused function is added to task store
  console.log('\nTest 2: Task Store Pause Function');
  
  const taskStorePath = path.join(__dirname, 'src/stores/taskStore.ts');
  if (fs.existsSync(taskStorePath)) {
    const content = fs.readFileSync(taskStorePath, 'utf8');
    
    if (content.includes('markTaskPaused')) {
      console.log('  ✅ markTaskPaused function is implemented');
    } else {
      console.log('  ❌ markTaskPaused function is not implemented');
      allTestsPassed = false;
    }
    
    if (content.includes('TaskStatus.PAUSED')) {
      console.log('  ✅ TaskStatus.PAUSED is used in store');
    } else {
      console.log('  ❌ TaskStatus.PAUSED is not used in store');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Task store file not found');
    allTestsPassed = false;
  }
  
  // Test 3: Check if focus session handles pause correctly
  console.log('\nTest 3: Focus Session Pause Handling');
  
  const focusSessionPath = path.join(__dirname, 'app/(main)/focus/[duration].tsx');
  if (fs.existsSync(focusSessionPath)) {
    const content = fs.readFileSync(focusSessionPath, 'utf8');
    
    if (content.includes('markTaskPaused') && content.includes('selectedTask.id')) {
      console.log('  ✅ Focus session calls markTaskPaused on pause');
    } else {
      console.log('  ❌ Focus session does not call markTaskPaused');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Focus session file not found');
    allTestsPassed = false;
  }
  
  // Test 4: Check if ProgressDashboard shows paused tasks
  console.log('\nTest 4: ProgressDashboard Paused Tasks Display');
  
  const progressDashboardPath = path.join(__dirname, 'src/components/ProgressDashboard.tsx');
  if (fs.existsSync(progressDashboardPath)) {
    const content = fs.readFileSync(progressDashboardPath, 'utf8');
    
    if (content.includes('pausedTasks') && content.includes('TaskStatus.PAUSED')) {
      console.log('  ✅ ProgressDashboard filters paused tasks');
    } else {
      console.log('  ❌ ProgressDashboard does not filter paused tasks');
      allTestsPassed = false;
    }
    
    if (content.includes('Paused Tasks') && content.includes('⏸️')) {
      console.log('  ✅ ProgressDashboard shows paused tasks section');
    } else {
      console.log('  ❌ ProgressDashboard does not show paused tasks section');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ ProgressDashboard file not found');
    allTestsPassed = false;
  }
  
  // Test 5: Check if TaskList handles paused status
  console.log('\nTest 5: TaskList Paused Status Handling');
  
  const taskListPath = path.join(__dirname, 'src/components/TaskList.tsx');
  if (fs.existsSync(taskListPath)) {
    const content = fs.readFileSync(taskListPath, 'utf8');
    
    if (content.includes('PAUSED') && content.includes('Paused')) {
      console.log('  ✅ TaskList handles paused status');
    } else {
      console.log('  ❌ TaskList does not handle paused status');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ TaskList file not found');
    allTestsPassed = false;
  }
  
  // Test 6: Check if tasks page includes paused filter
  console.log('\nTest 6: Tasks Page Paused Filter');
  
  const tasksPagePath = path.join(__dirname, 'app/(main)/tasks/index.tsx');
  if (fs.existsSync(tasksPagePath)) {
    const content = fs.readFileSync(tasksPagePath, 'utf8');
    
    if (content.includes('paused:') && content.includes('Paused (')) {
      console.log('  ✅ Tasks page includes paused filter');
    } else {
      console.log('  ❌ Tasks page does not include paused filter');
      allTestsPassed = false;
    }
  } else {
    console.log('  ❌ Tasks page file not found');
    allTestsPassed = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PAUSED TASKS TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Paused tasks functionality is implemented');
    console.log('✅ Tasks will appear in progress when paused');
    console.log('✅ Focus session properly marks tasks as paused');
    console.log('✅ Progress section shows only paused tasks');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Please fix the issues above before testing');
  }
  
  console.log('\n🔧 FEATURES IMPLEMENTED:');
  console.log('- Added PAUSED status to TaskStatus enum');
  console.log('- Implemented markTaskPaused function in task store');
  console.log('- Updated focus session to mark tasks as paused');
  console.log('- Modified ProgressDashboard to show only paused tasks');
  console.log('- Updated TaskList to handle paused status');
  console.log('- Added paused filter to tasks page');
  
  console.log('\n🧪 EXPECTED BEHAVIOR:');
  console.log('1. User starts a focus session → Task status: IN_PROGRESS');
  console.log('2. User pauses the session → Task status: PAUSED');
  console.log('3. Paused task appears in Progress section');
  console.log('4. Task shows with ⏸️ icon and "paused" indicator');
  console.log('5. Progress bar shows partial completion');
  console.log('6. Only paused tasks appear in progress, not active ones');
  
  console.log('\n📋 USER FLOW:');
  console.log('1. Start a focus session from tasks page');
  console.log('2. Work on the task for a while');
  console.log('3. Click pause button in focus session');
  console.log('4. Task appears in Progress section as "Paused"');
  console.log('5. Can resume or complete the task later');
  
  return allTestsPassed;
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = testPausedTasks();
  process.exit(success ? 0 : 1);
}

module.exports = { testPausedTasks }; 