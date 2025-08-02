#!/bin/bash

echo "🧪 Running Focus-AI Test Suite..."
echo "=================================="

# Install dependencies if needed
echo "📦 Installing test dependencies..."
npm install

# Run tests with coverage
echo "🚀 Starting test execution..."
npm run test:coverage

echo "✅ Test execution completed!"
echo "📊 Check the coverage report above for detailed results." 