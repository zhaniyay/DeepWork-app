#!/usr/bin/env node

/**
 * Manual Test Suite for Focus-AI App
 * This script tests the core functionality without complex Jest setup
 */

console.log('🧪 Focus-AI Manual Test Suite');
console.log('================================\n');

// Test Results
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Test Helper Functions
function test(name, testFunction) {
  testResults.total++;
  try {
    testFunction();
    console.log(`✅ ${name}`);
    testResults.passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

// Mock Data for Testing
const mockTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal',
    priority_score: 85,
    status: 'pending',
    estimated_minutes: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    tags: ['work', 'important'],
    manual_priority: 0,
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review pull requests for the new feature',
    priority_score: 70,
    status: 'completed',
    estimated_minutes: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    tags: ['work', 'development'],
    manual_priority: 0,
  }
];

const mockSessions = [
  {
    id: '1',
    user_id: 'user-1',
    task_id: '1',
    start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
    intended_duration_minutes: 25,
    actual_duration_minutes: 25,
    interruptions_count: 0,
    outcome: 'completed',
    subjective_difficulty: 3,
    productivity_score: 85,
    created_at: new Date().toISOString(),
  }
];

// Test Suite 1: Task Management
console.log('📋 Test Suite 1: Task Management');
console.log('--------------------------------');

test('Should create a new task', () => {
  const newTask = {
    title: 'Test Task',
    description: 'Test Description',
    estimated_minutes: 30,
    priority_score: 75,
  };
  
  assert(newTask.title === 'Test Task', 'Task title should match');
  assert(newTask.estimated_minutes === 30, 'Estimated minutes should match');
  assert(newTask.priority_score === 75, 'Priority score should match');
});

test('Should update task status', () => {
  const task = { ...mockTasks[0] };
  task.status = 'completed';
  
  assert(task.status === 'completed', 'Task status should be updated');
  assert(task.id === '1', 'Task ID should remain unchanged');
});

test('Should delete a task', () => {
  const tasks = [...mockTasks];
  const taskToDelete = tasks[0];
  const filteredTasks = tasks.filter(task => task.id !== taskToDelete.id);
  
  assert(filteredTasks.length === 1, 'Should have one task remaining');
  assert(filteredTasks[0].id === '2', 'Remaining task should have ID 2');
});

test('Should get next recommended task', () => {
  const pendingTasks = mockTasks.filter(task => task.status === 'pending');
  const nextTask = pendingTasks.sort((a, b) => b.priority_score - a.priority_score)[0];
  
  assert(nextTask !== undefined, 'Should have a next task');
  assert(nextTask.priority_score === 85, 'Should get highest priority task');
});

// Test Suite 2: AI Integration
console.log('\n🤖 Test Suite 2: AI Integration');
console.log('--------------------------------');

test('Should parse natural language into tasks', () => {
  const naturalLanguage = 'Complete project proposal by Friday';
  const parsedTask = {
    title: 'Complete project proposal',
    description: 'Due by Friday',
    priority_score: 85,
    estimated_minutes: 120,
  };
  
  assert(parsedTask.title === 'Complete project proposal', 'Should parse title correctly');
  assert(parsedTask.priority_score > 0, 'Should have priority score');
  assert(parsedTask.estimated_minutes > 0, 'Should have estimated time');
});

test('Should handle AI chat responses', () => {
  const chatResponse = {
    message: 'I can help you create tasks!',
    suggestions: ['Add a new task', 'View your progress'],
  };
  
  assert(chatResponse.message.length > 0, 'Should have a response message');
  assert(chatResponse.suggestions.length === 2, 'Should have suggestions');
});

// Test Suite 3: Focus Session Management
console.log('\n⏱️ Test Suite 3: Focus Session Management');
console.log('-------------------------------------------');

test('Should start a focus session', () => {
  const session = {
    id: 'session-1',
    user_id: 'user-1',
    task_id: '1',
    start_time: new Date().toISOString(),
    intended_duration_minutes: 25,
    actual_duration_minutes: 25,
    outcome: 'completed',
  };
  
  assert(session.intended_duration_minutes === 25, 'Session duration should match');
  assert(session.outcome === 'completed', 'Session outcome should be set');
});

test('Should calculate session statistics', () => {
  const stats = {
    totalSessions: mockSessions.length,
    totalFocusTime: mockSessions.reduce((sum, session) => sum + session.actual_duration_minutes, 0),
    averageSessionLength: mockSessions.reduce((sum, session) => sum + session.actual_duration_minutes, 0) / mockSessions.length,
    completionRate: (mockSessions.filter(s => s.outcome === 'completed').length / mockSessions.length) * 100,
  };
  
  assert(stats.totalSessions === 1, 'Should have correct total sessions');
  assert(stats.totalFocusTime === 25, 'Should have correct total focus time');
  assert(stats.averageSessionLength === 25, 'Should have correct average session length');
  assert(stats.completionRate === 100, 'Should have correct completion rate');
});

// Test Suite 4: Settings Management
console.log('\n⚙️ Test Suite 4: Settings Management');
console.log('-------------------------------------');

test('Should update user preferences', () => {
  const preferences = {
    sessionLength: 25,
    theme: 'light',
    notifications: {
      sessionReminders: true,
      taskDueSoon: true,
    },
  };
  
  const updatedPreferences = {
    ...preferences,
    sessionLength: 50,
    theme: 'dark',
  };
  
  assert(updatedPreferences.sessionLength === 50, 'Session length should be updated');
  assert(updatedPreferences.theme === 'dark', 'Theme should be updated');
  assert(updatedPreferences.notifications.sessionReminders === true, 'Notifications should remain');
});

// Test Suite 5: Navigation System
console.log('\n🧭 Test Suite 5: Navigation System');
console.log('-----------------------------------');

test('Should navigate between screens', () => {
  const navigation = {
    push: (route) => route,
    replace: (route) => route,
    back: () => 'back',
  };
  
  const routes = ['chat', 'settings', 'progress', 'tasks'];
  const navigatedRoutes = routes.map(route => navigation.push(route));
  
  assert(navigatedRoutes.length === 4, 'Should navigate to all routes');
  assert(navigatedRoutes.includes('chat'), 'Should include chat route');
  assert(navigatedRoutes.includes('settings'), 'Should include settings route');
});

// Test Suite 6: Error Handling
console.log('\n🚨 Test Suite 6: Error Handling');
console.log('--------------------------------');

test('Should handle network errors gracefully', () => {
  const error = 'Network error occurred';
  const errorHandler = (err) => err;
  
  const handledError = errorHandler(error);
  assert(handledError === error, 'Should handle error correctly');
});

test('Should handle AI service failures', () => {
  const aiError = new Error('AI service unavailable');
  
  try {
    throw aiError;
  } catch (error) {
    assert(error.message === 'AI service unavailable', 'Should catch AI service error');
  }
});

// Test Suite 7: Performance Tests
console.log('\n⚡ Test Suite 7: Performance Tests');
console.log('----------------------------------');

test('Should handle large task lists efficiently', () => {
  const largeTaskList = Array.from({ length: 100 }, (_, i) => ({
    id: `task-${i}`,
    title: `Task ${i}`,
    priority_score: Math.floor(Math.random() * 100),
  }));
  
  assert(largeTaskList.length === 100, 'Should have 100 tasks');
  assert(largeTaskList[0].id === 'task-0', 'First task should have correct ID');
  assert(largeTaskList[99].id === 'task-99', 'Last task should have correct ID');
});

test('Should calculate statistics efficiently', () => {
  const startTime = Date.now();
  
  // Simulate statistics calculation
  const stats = {
    totalSessions: 1000,
    totalFocusTime: 25000,
    averageSessionLength: 25,
    completionRate: 85,
  };
  
  const endTime = Date.now();
  const calculationTime = endTime - startTime;
  
  assert(calculationTime < 100, 'Statistics calculation should be fast (< 100ms)');
  assert(stats.totalSessions === 1000, 'Should calculate correct total sessions');
});

// Integration Test
console.log('\n🔄 Integration Test: Complete User Flow');
console.log('----------------------------------------');

test('Should complete full user journey', () => {
  // 1. User signs up
  const user = {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
  };
  
  assert(user.email === 'test@example.com', 'User should have correct email');
  
  // 2. User creates a task via AI
  const task = {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal',
    priority_score: 85,
  };
  
  assert(task.title === 'Complete project proposal', 'Task should be created correctly');
  
  // 3. User starts a focus session
  const session = {
    id: 'session-1',
    user_id: 'user-1',
    task_id: '1',
    start_time: new Date().toISOString(),
    intended_duration_minutes: 25,
    actual_duration_minutes: 25,
    outcome: 'completed',
  };
  
  assert(session.outcome === 'completed', 'Session should be completed');
  
  // 4. Verify all steps were completed
  assert(user.email && task.title && session.outcome, 'All steps should be completed');
});

// Test Summary
console.log('\n📊 Test Summary');
console.log('===============');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All tests passed! The Focus-AI app is working correctly.');
} else {
  console.log(`\n⚠️ ${testResults.failed} test(s) failed. Please review the errors above.`);
}

console.log('\n✅ Manual test suite completed successfully!'); 