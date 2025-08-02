# 🤖 AI Bot Fix Guide

## 🚨 Issue: AI Bot Not Working

The AI bot is showing a "DeepSeek API error" because the API key is not configured.

## ✅ Solution Steps

### 1. **Get Your DeepSeek API Key**

1. Go to [DeepSeek Platform](https://platform.deepseek.com)
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Copy the API key (it starts with `sk-`)

### 2. **Update Your Environment File**

Open your `.env` file and update the DeepSeek configuration:

```bash
# DeepSeek AI Configuration
EXPO_PUBLIC_DEEPSEEK_API_URL=https://api.deepseek.com/v1
EXPO_PUBLIC_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
```

**Replace `sk-your-actual-api-key-here` with your real DeepSeek API key.**

### 3. **Restart the Development Server**

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm start
```

### 4. **Test the AI Bot**

1. Open the app
2. Go to the AI Chat screen
3. Try asking: "Create a task to finish the project by Friday"
4. The AI should now respond properly

## 🔧 Alternative: Use Fallback Mode

If you don't want to set up DeepSeek right now, the app will work with fallback responses:

- ✅ Task creation will still work (simple fallback)
- ✅ Chat will provide helpful responses
- ✅ All other features remain functional

## 🎯 What the AI Bot Can Do

### **Task Creation**
- Parse natural language into structured tasks
- Extract due dates and priorities
- Suggest appropriate time estimates

### **Chat Assistance**
- Help break down complex tasks
- Provide productivity tips
- Suggest focus session durations
- Answer questions about time management

### **Smart Recommendations**
- Recommend the best next task
- Suggest session durations
- Provide motivation and guidance

## 🚀 Quick Test

Try these commands in the AI chat:

1. **"Create a task to review the code changes"**
2. **"What should I work on next?"**
3. **"Help me prioritize my tasks"**
4. **"How long should my focus session be?"**

## 🔍 Troubleshooting

### **Still Getting API Errors?**

1. **Check your API key format:**
   - Should start with `sk-`
   - No extra spaces or characters

2. **Verify the environment variable:**
   ```bash
   # Check if the variable is loaded
   echo $EXPO_PUBLIC_DEEPSEEK_API_KEY
   ```

3. **Restart the development server:**
   ```bash
   npm start
   ```

### **API Key Not Working?**

1. **Check your DeepSeek account:**
   - Ensure you have credits/usage available
   - Verify the API key is active

2. **Try the fallback mode:**
   - The app will work without the API key
   - Just with simpler responses

## 📊 Current Status

- ✅ **App Structure**: Complete
- ✅ **Fallback Mode**: Working
- ✅ **Error Handling**: Improved
- ⚠️ **DeepSeek Integration**: Needs API key

## 🎉 Success Indicators

When the AI bot is working correctly, you should see:

1. **No more "DeepSeek API error" messages**
2. **Intelligent responses to your questions**
3. **Proper task parsing from natural language**
4. **Helpful suggestions and recommendations**

## 🔗 Useful Links

- [DeepSeek Platform](https://platform.deepseek.com)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Focus-AI Documentation](./docs/)

---

**Need help?** The app will work with fallback responses even without the API key configured! 