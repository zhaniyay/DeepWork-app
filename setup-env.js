#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Focus-AI Environment Setup');
console.log('=============================\n');

const envContent = `# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# DeepSeek AI Configuration
EXPO_PUBLIC_DEEPSEEK_API_URL=https://api.deepseek.com/v1
EXPO_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key_here

# App Configuration
EXPO_PUBLIC_APP_NAME=Focus-AI
EXPO_PUBLIC_APP_VERSION=1.0.0
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('Please update your existing .env file with the following variables:\n');
} else {
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file successfully!\n');
  } catch (error) {
    console.log('❌ Could not create .env file automatically.');
    console.log('Please create it manually with the following content:\n');
  }
}

console.log('📝 Required Environment Variables:');
console.log('==================================');
console.log('');
console.log('1. Supabase Configuration:');
console.log('   - Get your Supabase URL and anon key from: https://supabase.com');
console.log('   - Replace "your_supabase_url_here" with your actual Supabase URL');
console.log('   - Replace "your_supabase_anon_key_here" with your actual anon key');
console.log('');
console.log('2. DeepSeek AI Configuration:');
console.log('   - Get your DeepSeek API key from: https://platform.deepseek.com');
console.log('   - Replace "your_deepseek_api_key_here" with your actual API key');
console.log('');
console.log('3. App Configuration:');
console.log('   - These are optional and can be left as default');
console.log('');
console.log('📋 Example .env file content:');
console.log('=============================');
console.log(envContent);
console.log('');
console.log('🔗 Useful Links:');
console.log('================');
console.log('- Supabase Dashboard: https://supabase.com/dashboard');
console.log('- DeepSeek Platform: https://platform.deepseek.com');
console.log('- Focus-AI Documentation: Check the docs/ folder');
console.log('');
console.log('⚠️  Important Notes:');
console.log('===================');
console.log('- Keep your API keys secure and never commit them to version control');
console.log('- The .env file is already in .gitignore to prevent accidental commits');
console.log('- Restart your development server after updating the .env file');
console.log('');
console.log('🚀 After setting up your environment variables:');
console.log('==============================================');
console.log('1. Update the .env file with your actual API keys');
console.log('2. Restart the development server: npm start');
console.log('3. The AI features should now work properly');
console.log('');
console.log('✅ Setup complete!'); 