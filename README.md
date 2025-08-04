# Focus-AI

A productivity app that helps you focus on one task at a time with AI assistance and smart task management.

## Features

- AI-powered task creation using natural language
- Smart focus sessions with customizable durations
- Progress tracking and analytics dashboard
- Beautiful pastel purple UI theme
- Complete authentication system
- Cross-platform (iOS and Android)
- Performance optimized with React.memo and useMemo

## Screenshots

[Add your screenshots here]

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Focus-AI.git
   cd Focus-AI
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run on your device
   - Scan the QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## Tech Stack

- React Native with Expo
- Expo Router for navigation
- Zustand for state management
- React Native Paper for UI components
- TypeScript for type safety

## Project Structure

```
Focus-AI/
├── app/                    # Expo Router pages
├── src/
│   ├── components/        # Reusable components
│   ├── stores/           # State management
│   ├── services/         # API and AI services
│   ├── types/            # TypeScript definitions
│   └── constants/        # App constants
└── assets/               # Images and resources
```

## Key Features

### AI-Powered Task Creation
- Natural language processing
- Smart priority and time estimation
- Tag-based organization

### Smart Focus Sessions
- Pomodoro technique (25/5 minute cycles)
- Customizable session durations
- Progress tracking with visual feedback

### Performance Optimized
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for event handlers

## Configuration

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
EXPO_PUBLIC_OPENAI_API_URL=https://api.openai.com/v1
```

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

### Build for production
```bash
npx eas build --platform all
```

### Deploy to app stores
```bash
npx eas submit --platform all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
