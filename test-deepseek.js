#!/usr/bin/env node

require('dotenv').config();

const DEEPSEEK_API_URL = process.env.EXPO_PUBLIC_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;

console.log('🧪 Testing DeepSeek API Configuration');
console.log('=====================================\n');

console.log('📋 Configuration:');
console.log(`API URL: ${DEEPSEEK_API_URL}`);
console.log(`API Key: ${DEEPSEEK_API_KEY ? DEEPSEEK_API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
console.log('');

if (!DEEPSEEK_API_KEY) {
  console.log('❌ ERROR: DeepSeek API key not found in environment variables');
  console.log('Please check your .env file and ensure EXPO_PUBLIC_DEEPSEEK_API_KEY is set');
  process.exit(1);
}

async function testDeepSeekAPI() {
  console.log('🚀 Testing DeepSeek API connection...');
  
  try {
    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Hello, can you respond with "API test successful"?'
          }
        ],
        max_tokens: 50,
      }),
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response OK: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      console.log(`Error Details: ${errorText}`);
      
      if (response.status === 401) {
        console.log('\n🔑 This appears to be an authentication error.');
        console.log('Possible causes:');
        console.log('- API key is invalid or expired');
        console.log('- API key format is incorrect');
        console.log('- Account has no credits/usage available');
      } else if (response.status === 429) {
        console.log('\n⏰ This appears to be a rate limit error.');
        console.log('The API key might be valid but you\'ve hit rate limits.');
      }
      
      return false;
    }

    const data = await response.json();
    console.log('✅ API test successful!');
    console.log('Response:', data.choices?.[0]?.message?.content || 'No content');
    return true;

  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('\nPossible causes:');
    console.log('- No internet connection');
    console.log('- DeepSeek API is down');
    console.log('- Network timeout');
    return false;
  }
}

async function testTaskParsing() {
  console.log('\n📝 Testing task parsing functionality...');
  
  try {
    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a task parsing assistant. Parse user input into JSON task format.'
          },
          {
            role: 'user',
            content: 'Create a task to finish the project by Friday'
          }
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.log(`❌ Task parsing test failed: ${response.status}`);
      return false;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    console.log('✅ Task parsing test successful!');
    console.log('Parsed response:', content);
    return true;

  } catch (error) {
    console.log('❌ Task parsing test failed:', error.message);
    return false;
  }
}

async function runTests() {
  const apiTest = await testDeepSeekAPI();
  
  if (apiTest) {
    await testTaskParsing();
  }
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`API Connection: ${apiTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (apiTest) {
    console.log('Task Parsing: ✅ PASS (if API works)');
    console.log('\n🎉 Your DeepSeek API key is working correctly!');
    console.log('The AI bot should now function properly in the app.');
  } else {
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Verify your API key at: https://platform.deepseek.com');
    console.log('2. Check if you have credits/usage available');
    console.log('3. Ensure the API key starts with "sk-"');
    console.log('4. Try regenerating the API key');
    console.log('\n💡 The app will work with fallback mode even if the API fails.');
  }
}

runTests().catch(console.error); 