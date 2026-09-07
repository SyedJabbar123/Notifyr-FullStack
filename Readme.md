# Notifyr - Full Stack System

This repository contains the complete codebase for **Notifyr** (a privacy-focused QR-code asset tracking and anonymous communication system). It includes the React JS web dashboard, the React Native mobile application, and the Node.js backend.

**Developer:** Minahil Abid, Syed Jabbar, Adeeba Shahzadi

---

## 📂 Repository Structure

This is a consolidated repository. The system is divided into three separate environments:

*   `Notifyr-Web/` - React JS frontend (Admin/Web Dashboard)
*   `NotifyrApp/` - React Native CLI frontend (Mobile Application)
*   `Backend/` - Node.js & Express server

---

## ⚙️ Prerequisites

To run this project locally, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16+)
*   [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) (Android Studio / Xcode)
*   Git

---

## 🔐 Environment Variables & Credentials

For security reasons, database keys and environment files are not included in this repository. Before starting the servers, you must configure the following in their respective directories:

### 1. Node.js Backend
Rename `.env.example` to `.env` in the backend directory and fill in the missing values.
You must also place the following credential files in the root of the backend directory:
*   `firebase-service-account.json` (Firebase Admin SDK credentials)
*   `ca.pem` (Database certificate)

### 2. React Native App
Rename `.env.example` to `.env` in the `NotifyrApp` directory and add the required API keys.

---

## 🚀 Installation & Running Instructions

Open three separate terminal windows to run the environments concurrently.

### 1. Start the Backend (Node.js)
```bash
cd Backend
npm install
npm start



2. Start the Web Dashboard (React JS)
Bash
cd Notifyr-Web
npm install
npm run dev
The web interface will be available at http://localhost:5173 (Vite).

3. Start the Mobile App (React Native)
Make sure your Android Emulator or iOS Simulator is running, or a physical device is connected.

Bash
cd NotifyrApp
npm install

# For Android
npm run android

# For iOS (Mac only, requires pod install first)
cd ios && pod install && cd ..
npm run ios
🧪 Troubleshooting
Metro Bundler Issues: If the mobile app fails to start, clear the Metro cache: npm start -- --reset-cache inside the NotifyrApp directory.

Database Connection: Ensure ca.pem and firebase-service-account.json are placed exactly as specified in the backend directory.


<FollowUp label="Review Git commands to push" query="What are the exact Git commands to init