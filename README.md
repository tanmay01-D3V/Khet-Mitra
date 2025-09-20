# Khet-Mitra: Your AI Farming Companion

<div align="center">
  <img src="https://storage.googleapis.com/maker-studio-project-files-prod/f46f3661-d774-4b53-936a-2d939611f7c3/khet-mitra-logo.png" alt="Khet-Mitra Logo" width="150">
</div>

**Khet-Mitra** (Hindi for "Farm Friend") is an AI-powered, multilingual application designed to empower Indian farmers. It serves as a single, accessible digital toolkit for real-time agricultural intelligence, offering data-driven insights for crop health, soil management, and fair market access to enhance productivity and profitability.

## Problem Statement

Indian farmers lack a single, accessible digital tool for real-time agricultural intelligence and fair market access. Key challenges include:
- Lack of quick access to expert agricultural advice.
- Fragmentation of critical data like weather and market prices.
- Difficulty for small-scale farmers to secure fair market prices.
- Poor user experience of existing digital tools for rural farmers.

## ✨ Key Features

- **Aadhaar Login**: Quick and secure login by entering or scanning an Aadhaar card.
- **Disease Identification**: Instantly diagnose crop diseases by uploading a photo.
- **Soil Analysis & Crop Recommendation**: Get crop and fertilizer recommendations from a soil report image.
- **Weather Forecast**: View a 7-day weather forecast and receive location-based crop advice.
- **Marketplace**: Access the latest wholesale prices for various crops.
- **My Poll Sensor**: Monitor real-time soil data from a connected hardware device.
- **Farmer Chatroom**: Connect with nearby farmers in a local chatroom.
- **Param-Mitr AI Chat**: Ask farming questions in your native language and get instant AI-powered answers with audio playback.
- **Multi-Language Support**: Fully functional in English, Hindi, and 11 other Indian languages.

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js with React & TypeScript
- **Generative AI**: Genkit with Google's Gemini Models (Gemini 2.5 Flash & TTS)
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API & Hooks
- **Authentication**: Client-side (localStorage)
- **Internationalization (i18n)**: Custom solution with JSON language files

## 🚀 Getting Started

To run Khet-Mitra locally, follow these steps:

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 1. Clone the Repository

First, clone the repository to your local machine:
```bash
git clone https://github.com/your-username/khet-mitra.git
cd khet-mitra
```

### 2. Install Dependencies

Install the project dependencies using npm:
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project and add your Google Gemini API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the Development Server

You need to run two separate processes for the application and the AI flows.

**Terminal 1: Run the Next.js App**
```bash
npm run dev
```
This will start the frontend application, typically on `http://localhost:9002`.

**Terminal 2: Run the Genkit Flows**
```bash
npm run genkit:dev
```
This starts the Genkit development server, allowing the AI flows to be executed.

### 5. Open the Application

Open your browser and navigate to `http://localhost:9002` to start using Khet-Mitra.

## 📂 Project Structure

The project is organized as follows:
- `src/app/`: Contains the main pages and layouts of the Next.js application.
- `src/ai/`:
  - `flows/`: All Genkit AI workflows that power the intelligent features.
  - `tools/`: External functions (like weather) that the AI can call.
- `src/components/`: Shared React components used throughout the app (UI, layout, etc.).
- `src/context/`: React context providers for managing global state (auth, language).
- `src/hooks/`: Custom React hooks for shared logic.
- `src/locales/`: JSON files for internationalization (i18n).
- `src/lib/`: Utility functions and library configurations.
- `public/`: Static assets like images and fonts.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made by **The Chefs** - with Spices 🔥👨‍🍳

