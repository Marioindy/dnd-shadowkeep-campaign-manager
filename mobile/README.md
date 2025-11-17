# Shadowkeep Campaign Manager - Mobile App

Native mobile application for the Shadowkeep D&D Campaign Manager, built with React Native and Expo.

## 🚀 Features

### ✅ Implemented (Phase 3 - Foundation)
- **Cross-Platform Support**: iOS and Android from a single codebase
- **Touch-Optimized UI**: Native mobile components designed for touch interactions
- **Mobile Navigation**: Bottom tab navigation with native patterns
- **Responsive Layouts**: Adapts to different screen sizes (phones and tablets)
- **Offline Foundation**: AsyncStorage for local data persistence
- **Push Notifications**: Infrastructure for session updates and alerts
- **Real-time Sync**: Convex integration for live data updates
- **Authentication**: Secure login flow with persistent sessions

### 📱 Current Screens
1. **Login** - Authentication with username/password
2. **Dashboard** - Campaign overview and quick actions
3. **Character Sheet** - View character stats, abilities, and modifiers
4. **Inventory** - Manage equipment and items
5. **Maps** - Browse campaign maps
6. **Session Tools** - Dice roller and quick reference tools

## 🛠️ Tech Stack

- **React Native 0.81.5** - Mobile framework
- **Expo ~54** - Development platform and tooling
- **TypeScript 5.9** - Type safety
- **React Navigation** - Native navigation patterns
- **Convex** - Real-time backend and database
- **AsyncStorage** - Offline data persistence
- **Expo Notifications** - Push notification system

## 📋 Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio
- Or use Expo Go app on your device for development

## 🏃 Getting Started

### 1. Installation

```bash
cd mobile
npm install
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the Convex URL in `.env`:
```
EXPO_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 3. Run the Development Server

Start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser.

### 4. Run on Device/Simulator

**Option A: Use Expo Go (Easiest)**
1. Install Expo Go from App Store (iOS) or Google Play (Android)
2. Scan the QR code from the terminal with your camera (iOS) or Expo Go app (Android)

**Option B: iOS Simulator (macOS only)**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

**Option D: Web (for testing)**
```bash
npm run web
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI primitives (Button, Card, Input)
│   │   └── shared/         # Shared components (ScreenContainer)
│   ├── config/             # Configuration
│   │   ├── theme.ts        # Theme colors, spacing, typography
│   │   └── constants.ts    # App constants
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ConvexProvider.tsx # Convex real-time client
│   ├── navigation/         # Navigation structure
│   │   └── AppNavigator.tsx # Main navigation config
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   └── dashboard/      # Player-facing screens
│   ├── services/           # External services
│   │   ├── convex.ts       # Convex client
│   │   ├── storage.ts      # AsyncStorage wrapper
│   │   └── notifications.ts # Push notifications
│   ├── types/              # TypeScript types (shared with web)
│   └── utils/              # Utility functions
│       └── dnd.ts          # D&D calculations (dice, modifiers)
├── assets/                 # Images, fonts, icons
├── App.tsx                 # App entry point
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## 🎨 Design System

The mobile app uses a **dark purple/pink gradient theme** matching the web app:

### Colors
- **Primary**: Dark purple (`#1a0a2e`) to pink (`#d946ef`) gradient
- **Background**: Dark purple shades
- **Accent**: Purple/pink for interactive elements
- **Text**: White with purple tints for secondary text

### Touch Targets
- Minimum size: 44pt (iOS guideline)
- Button height: 48pt
- Icon size: 24pt

### Responsive Breakpoints
- Mobile: 320-767px
- Tablet: 768px+

## 🔐 Authentication

The app uses a mock authentication system. To implement real authentication:

1. Update `src/contexts/AuthContext.tsx`:
   - Replace mock login with Convex authentication
   - Implement proper JWT token handling

2. Update `src/services/convex.ts`:
   - Add authentication headers
   - Handle token refresh

3. See web app's authentication pattern for reference

## 📡 Offline Capabilities

### Current Implementation
- **AsyncStorage** for local data persistence
- User session persists across app restarts
- Auth tokens stored securely

### Future Enhancements
- Cache character data for offline viewing
- Queue mutations for when back online
- Sync indicator in UI
- Conflict resolution strategy

## 🔔 Push Notifications

### Setup
1. Register device for push notifications (handled automatically)
2. Push token saved to storage
3. Ready for backend integration

### Usage Example
```typescript
import { scheduleLocalNotification } from './src/services/notifications';

// Schedule a notification
await scheduleLocalNotification(
  'Session Starting Soon!',
  'Your D&D session starts in 30 minutes',
  { sessionId: '123' },
  1800 // 30 minutes in seconds
);
```

### Backend Integration
Send push notifications via Expo's push notification service:
```
POST https://exp.host/--/api/v2/push/send
{
  "to": "ExponentPushToken[...]",
  "title": "Session Update",
  "body": "The DM has updated the map"
}
```

## 🧪 Testing

### Manual Testing
1. Test on both iOS and Android
2. Test on different screen sizes
3. Test offline mode
4. Test push notifications

### Future: Automated Testing
```bash
# Add testing dependencies
npm install --save-dev jest @testing-library/react-native

# Run tests
npm test
```

## 📦 Building for Production

### iOS (requires macOS and Apple Developer account)
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🚀 Deployment

### Over-the-Air Updates
Expo supports OTA updates without app store approval:
```bash
expo publish
```

### App Store Submission
1. Build production app
2. Submit to Apple App Store / Google Play
3. Follow platform-specific guidelines

## 🔄 Syncing with Web App

The mobile app shares:
- **Types** (`src/types/`) - Keep in sync with web app
- **Utilities** (`src/utils/dnd.ts`) - D&D calculations
- **Backend** - Same Convex database and API

When updating types in the web app, copy changes to mobile.

## 📝 TODO / Future Enhancements

### Phase 3 Completion
- [ ] Add app icons and splash screen
- [ ] Implement real Convex authentication
- [ ] Connect to actual Convex data (currently using mocks)
- [ ] Add loading states for data fetching
- [ ] Implement error boundaries
- [ ] Add proper navigation types

### Phase 4 - Enhanced Features
- [ ] Map viewer with pinch-to-zoom
- [ ] Image upload from camera
- [ ] Biometric authentication (Face ID / Touch ID)
- [ ] Dark mode toggle
- [ ] Initiative tracker with drag-to-reorder
- [ ] Spell book with search
- [ ] Campaign chat/messaging
- [ ] Voice notes
- [ ] PDF character sheet export

## 🐛 Known Issues

1. **Convex URL** - Must be configured in `.env` file
2. **Mock Data** - Screens currently show placeholder data
3. **Tab Icons** - Navigation tabs don't have icons yet
4. **EAS Project ID** - Must be set for push notifications to work

## 🤝 Contributing

When adding new features:
1. Follow existing component patterns
2. Use TypeScript for all new files
3. Follow the design system (colors, spacing)
4. Test on both iOS and Android
5. Update this README

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Convex Documentation](https://docs.convex.dev/)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

## 📄 License

MIT License - See main project LICENSE file

## 👥 Support

For issues or questions:
1. Check the main project README
2. Review Expo documentation
3. Check React Native troubleshooting guides
4. Open an issue in the main repository

---

Built with ❤️ for D&D adventurers on the go!
