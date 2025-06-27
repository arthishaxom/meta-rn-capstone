# Little Lemon Capstone Project 🍋

Welcome to the **Little Lemon** restaurant app, built as a capstone project for the Meta Mobile Developer curriculum. This app demonstrates modern React Native development with Expo, focusing on clean UI, local data persistence, and a smooth user experience.

---

## 📱 App Overview

**Little Lemon** is a Mediterranean restaurant app that allows users to:

- Browse the menu with images and descriptions
- Filter dishes by category and search by name
- View and edit their profile, including avatar and notification preferences
- Experience a responsive, mobile-first design

---

## ✨ Features

- **Tabbed Navigation:** Uses Expo Router’s file-based routing to provide a Home (menu) and Profile tab for easy navigation.
- **Safe Area Support:** All screens are wrapped in `SafeAreaView` to ensure content is displayed correctly on all devices, respecting notches and system UI.
- **Modern UI Components:** Built with [Gluestack UI](https://ui.gluestack.io/) for consistent, themeable, and accessible design.
- **Persistent Local Storage:** Menu data is cached locally using SQLite for offline access and fast loading.
- **Profile Management:** Users can update their name, email, phone, avatar, and notification settings, with changes saved locally.
- **Debounced Search:** Menu search input is debounced for performance, updating results only after the user stops typing.
- **Category Filtering:** Menu items can be filtered by multiple categories with a horizontal scrollable selector.
- **Discard Changes:** Profile edits can be discarded, instantly reverting to the last saved state.

---

## 🛠️ Libraries & Tools Used

- **[Expo](https://expo.dev/):** Rapid React Native development and cross-platform support.
- **[Expo Router](https://expo.github.io/router/docs/):** File-based navigation for tabs and screens.
- **[Gluestack UI](https://ui.gluestack.io/):** Modern, customizable UI primitives.
- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context):** Ensures UI respects device safe areas.
- **[SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/):** Local database for menu persistence.
- **[NativeWind](https://www.nativewind.dev/):** Tailwind CSS utility classes for React Native styling.
- **[expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/):** For avatar selection in the profile.
- **[react-native-mask-text](https://github.com/akinncar/react-native-mask-text):** For formatted phone number input.

---

## 🆚 What’s Different in This Project?

- **Tabs Instead of Stack Navigation:** The app uses a tabbed interface for Home and Profile, making navigation intuitive and modern.
- **SafeAreaView Everywhere:** All main screens use `SafeAreaView` to prevent UI overlap with device notches and system bars.
- **Gluestack UI for Consistency:** Instead of default React Native components, Gluestack UI is used for all layout and form elements, ensuring a cohesive look and feel.
- **Debounced Search & Category Filtering:** Menu search is optimized for performance, and users can filter by multiple categories at once.
- **Profile Discard Functionality:** Users can revert unsaved profile changes with a single tap, improving UX.
- **Local Menu Caching:** Menu data is fetched once and stored locally, so the app works offline and loads instantly on subsequent launches.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npx expo start
   ```

3. **Open in your preferred environment:**
   - Expo Go (QR code)
   - Android/iOS simulator
   - Web browser

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Gluestack UI Docs](https://ui.gluestack.io/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Expo Router Docs](https://expo.github.io/router/docs/)

---

## 🤝 Contributing

Pull requests and suggestions are welcome!

---

## 🏆 Credits

This project was developed as part of the Meta Mobile Developer Capstone.
