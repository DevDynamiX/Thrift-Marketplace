# React Native Expo Setup Guide

This guide will help you set up a React Native development environment using Expo on Windows, Linux, and macOS.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/) (Recommended: LTS version).
- **npm**: Comes with Node.js, but you can update it using the command: `npm install -g npm`.
- **Git**: [Download and install Git](https://git-scm.com/).

## 1. Install Expo CLI

Expo CLI is the command-line tool to manage and run your React Native projects with Expo.

```bash
npm install -g expo-cli
```

## 2. Create a New React Native Project
Use Expo CLI to create a new project:
```bash
expo init MyAwesomeProject
```
```bash
cd MyAwesomeProject
```

## 3. Setting Up the Development Environment

### Windows
#### 1. Install Android Studio:

- Download and install Android Studio.


- During installation, ensure that the Android SDK, Android SDK Platform, and Android Virtual Device are selected.

#### 2. Set Up Android SDK Environment Variable:

- Open `System Properties` -> `Environment Variables`.


- Under `System variables`, click `New`... and add `ANDROID_HOME` with the path to your Android SDK, usually located at `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`.


- Add the following paths to the `Path` environment variable:

```
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\platform-tools
```

#### 3. Install Expo Go on Your Device:

- Download the Expo Go app on your Android or iOS device from the Play Store or App Store.

#### 4. Run the Project:

```bash
npm start
```

- Scan the QR code with Expo Go to run the app on your device.

### Linux (Ubuntu/Debian)

#### 1. Install Node.js and npm:

- Install Node.js and npm using the NodeSource repository:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install Android Studio:

- Download and install Android Studio using the provided .deb package or via Snap:

```bash
sudo snap install android-studio --classic
```

#### 3. Set Up Android SDK Environment Variable:

- Open your terminal and add the following to your `~/.bashrc` or `~/.zshrc`:

```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

- Reload your terminal or run `source ~/.bashrc` or `source ~/.zshrc`.

```bash
source ~/.bashrc  # or source ~/.zshrc
```

#### 4. Install Expo Go on Your Device:

- Download the Expo Go app on your Android or iOS device from the Play Store or App Store.

#### 5. Run the Project:

```bash
npm start
```

### macOS

#### 1. Install Homebrew:

- Open your terminal and run the following command to install Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js and npm:

- Install Node.js and npm using Homebrew:

```bash
brew install node
```

#### 3. Install Android Studio:

- Download and install Android Studio.
- During installation, ensure that the Android SDK, Android SDK Platform, and Android Virtual Device are selected.
- Open Android Studio and install the required SDK packages.

#### 4. Set Up Android SDK Environment Variable:

- Open your terminal and add the following to your `~/.bash_profile` or `~/.zshrc`:

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

- Reload your terminal:

```bash
source ~/.bash_profile  # or source ~/.zshrc
```

#### 5. Install Expo Go on Your Device:

- Download the Expo Go app on your Android or iOS device from the Play Store or App Store.

#### 6. Run the Project:

```bash
npm run android
```

### Troubleshooting

- Metro Bundler Issues: Ensure that no other instances of Metro Bundler are running.
- Environment Variable Issues: Double-check the paths in your environment variables.
- Expo Go Connection Issues: Ensure your device and computer are on the same network.
