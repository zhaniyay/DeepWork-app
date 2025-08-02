#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Focus-AI App Structure Verification');
console.log('======================================\n');

const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

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

function assertFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${description} not found: ${filePath}`);
  }
}

function assertDirectoryExists(dirPath, description) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`${description} not found: ${dirPath}`);
  }
}

// Test App Structure
console.log('📁 App Structure Tests');
console.log('----------------------');

test('Should have package.json', () => {
  assertFileExists('package.json', 'package.json');
});

test('Should have tsconfig.json', () => {
  assertFileExists('tsconfig.json', 'tsconfig.json');
});

test('Should have app directory', () => {
  assertDirectoryExists('app', 'app directory');
});

test('Should have src directory', () => {
  assertDirectoryExists('src', 'src directory');
});

test('Should have app/_layout.tsx', () => {
  assertFileExists('app/_layout.tsx', 'app/_layout.tsx');
});

test('Should have app/index.tsx', () => {
  assertFileExists('app/index.tsx', 'app/index.tsx');
});

test('Should have app/(auth) directory', () => {
  assertDirectoryExists('app/(auth)', 'app/(auth) directory');
});

test('Should have app/(main) directory', () => {
  assertDirectoryExists('app/(main)', 'app/(main) directory');
});

// Test Source Structure
console.log('\n📂 Source Structure Tests');
console.log('-------------------------');

test('Should have src/types directory', () => {
  assertDirectoryExists('src/types', 'src/types directory');
});

test('Should have src/stores directory', () => {
  assertDirectoryExists('src/stores', 'src/stores directory');
});

test('Should have src/components directory', () => {
  assertDirectoryExists('src/components', 'src/components directory');
});

test('Should have src/services directory', () => {
  assertDirectoryExists('src/services', 'src/services directory');
});

test('Should have src/constants directory', () => {
  assertDirectoryExists('src/constants', 'src/constants directory');
});

test('Should have src/styles directory', () => {
  assertDirectoryExists('src/styles', 'src/styles directory');
});

// Test Type Definitions
console.log('\n📝 Type Definition Tests');
console.log('-------------------------');

test('Should have auth types', () => {
  assertFileExists('src/types/auth.ts', 'auth types');
});

test('Should have task types', () => {
  assertFileExists('src/types/task.ts', 'task types');
});

test('Should have session types', () => {
  assertFileExists('src/types/session.ts', 'session types');
});

test('Should have supabase types', () => {
  assertFileExists('src/types/supabase.ts', 'supabase types');
});

// Test Stores
console.log('\n🏪 Store Tests');
console.log('---------------');

test('Should have auth store', () => {
  assertFileExists('src/stores/authStore.ts', 'auth store');
});

test('Should have task store', () => {
  assertFileExists('src/stores/taskStore.ts', 'task store');
});

test('Should have progress store', () => {
  assertFileExists('src/stores/progressStore.ts', 'progress store');
});

test('Should have settings store', () => {
  assertFileExists('src/stores/settingsStore.ts', 'settings store');
});

// Test Components
console.log('\n🧩 Component Tests');
console.log('------------------');

test('Should have QuickAddTask component', () => {
  assertFileExists('src/components/QuickAddTask.tsx', 'QuickAddTask component');
});

test('Should have TaskList component', () => {
  assertFileExists('src/components/TaskList.tsx', 'TaskList component');
});

test('Should have FocusSession component', () => {
  assertFileExists('src/components/FocusSession.tsx', 'FocusSession component');
});

test('Should have AIChatInterface component', () => {
  assertFileExists('src/components/AIChatInterface.tsx', 'AIChatInterface component');
});

test('Should have ProgressDashboard component', () => {
  assertFileExists('src/components/ProgressDashboard.tsx', 'ProgressDashboard component');
});

test('Should have SessionSummary component', () => {
  assertFileExists('src/components/SessionSummary.tsx', 'SessionSummary component');
});

// Test Services
console.log('\n🔧 Service Tests');
console.log('----------------');

test('Should have Supabase client', () => {
  assertFileExists('src/services/supabase/client.ts', 'Supabase client');
});

test('Should have DeepSeek AI service', () => {
  assertFileExists('src/services/ai/deepseek.ts', 'DeepSeek AI service');
});

// Test Constants and Styles
console.log('\n🎨 Constants and Styles Tests');
console.log('-----------------------------');

test('Should have colors constants', () => {
  assertFileExists('src/constants/colors.ts', 'colors constants');
});

test('Should have session types constants', () => {
  assertFileExists('src/constants/sessionTypes.ts', 'session types constants');
});

test('Should have theme styles', () => {
  assertFileExists('src/styles/theme.ts', 'theme styles');
});

// Test App Screens
console.log('\n📱 App Screen Tests');
console.log('-------------------');

test('Should have dashboard screen', () => {
  assertFileExists('app/(main)/dashboard.tsx', 'dashboard screen');
});

test('Should have chat screen', () => {
  assertFileExists('app/(main)/chat/index.tsx', 'chat screen');
});

test('Should have focus session screen', () => {
  assertFileExists('app/(main)/focus/[duration].tsx', 'focus session screen');
});

test('Should have progress screen', () => {
  assertFileExists('app/(main)/progress/index.tsx', 'progress screen');
});

test('Should have settings screen', () => {
  assertFileExists('app/(main)/settings/index.tsx', 'settings screen');
});

test('Should have tasks screen', () => {
  assertFileExists('app/(main)/tasks/index.tsx', 'tasks screen');
});

test('Should have login screen', () => {
  assertFileExists('app/(auth)/login.tsx', 'login screen');
});

test('Should have signup screen', () => {
  assertFileExists('app/(auth)/signup.tsx', 'signup screen');
});

// Test Configuration Files
console.log('\n⚙️ Configuration Tests');
console.log('----------------------');

test('Should have .env file', () => {
  assertFileExists('.env', '.env file');
});

test('Should have .gitignore file', () => {
  assertFileExists('.gitignore', '.gitignore file');
});

// Test Dependencies
console.log('\n📦 Dependency Tests');
console.log('-------------------');

test('Should have React Native dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies;
  
  if (!dependencies['react-native']) {
    throw new Error('react-native dependency not found');
  }
  if (!dependencies['expo']) {
    throw new Error('expo dependency not found');
  }
  if (!dependencies['expo-router']) {
    throw new Error('expo-router dependency not found');
  }
  if (!dependencies['react-native-paper']) {
    throw new Error('react-native-paper dependency not found');
  }
  if (!dependencies['@supabase/supabase-js']) {
    throw new Error('@supabase/supabase-js dependency not found');
  }
  if (!dependencies['zustand']) {
    throw new Error('zustand dependency not found');
  }
});

// Test Summary
console.log('\n📊 Structure Verification Summary');
console.log('==================================');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All structure tests passed! The Focus-AI app structure is correct.');
} else {
  console.log(`\n⚠️ ${testResults.failed} test(s) failed. Please check the missing files/directories.`);
}

console.log('\n✅ App structure verification completed!'); 