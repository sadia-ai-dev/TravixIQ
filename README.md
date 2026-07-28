# ✈️ TravixIQ

**TravixIQ** is an AI-powered travel intelligence platform that helps users plan smarter trips, optimise travel budgets, discover personalised itineraries, detect travel scams, analyse destinations, and access intelligent travel assistance through one unified platform.

This project serves as a comprehensive travel companion, designed to streamline trip planning and enhance traveler safety through artificial intelligence.

---

## 🎯 The Problem It Solves

Travel planning is usually scattered across multiple apps for budgeting, itineraries, and safety. This app brings it all into one dashboard, helping travelers save time, avoid scams, and manage their trips effortlessly. 

**Target Audience:** Tourists, solo travelers, and vacation planners.

---

## 🔗 Live Deployed URL

Experience the live application here:  
**👉 [TravixIQ Live App](https://ais-pre-7rphfpz2trrckzhyz3pkfv-577175268077.asia-southeast1.run.app)**

---

## ✨ Features List

*   🎛️ **Cockpit View & Travel Pulse dashboard:** Real-time telemetry, weather insights, and a centralized hub for your trips.
*   🗺️ **AI Travel Planner:** Automatically generates day-by-day itineraries tailored to your travel style and budget.
*   💰 **Budget Tool:** Intelligently splits expenses into specific categories, provides daily averages, and offers savings suggestions.
*   🛡️ **Scam Shield Security Deck:** Provides destination-specific telemetry, regional fraud alerts, and a real-time AI scenario verification scanner to keep you safe.
*   🕌 **Halal Helper:** Dedicated features for Muslim travelers, including Qibla direction, local prayer schedules, and Halal dining spots.
*   🌓 **Dark Mode & Light Mode support:** A premium, responsive interface that adapts to your environment.

---

## 🧠 The AI Feature & Instructions

TravixIQ heavily leverages AI to automate complex research tasks and analyze risks on the fly.

### 🛡️ Scam Verification Scanner
The AI analyzes real-time scenarios reported by the user (e.g., "A taxi driver says my hotel is closed") against the context of their destination to determine the likelihood of a scam and provide immediate precautions.

**System Instruction Prompt:**
```text
Analyze a potential tourist scenario to check if it's a scam:
Scenario: {user_scenario}
Location/Country Context: {destination}
Provide a realistic safety analysis, confidence index, scam classification, precaution tips, and recommended actions. Return matching the requested JSON schema.
```

### 🗺️ AI Travel Planner
The AI curates a hyper-personalized, day-by-day travel plan based on various parameters.

**System Instruction Prompt:**
```text
Generate a comprehensive, highly realistic, professional-grade travel itinerary for:
Destination: {destination}
Duration: {days} days
Style: {style}
Companion Mode: {companionMode}
Budget Level: {budgetLevel}
Return the results matching the requested JSON schema, including specific activities, daily budgets, and meal suggestions.
```

---

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Node.js, Express
*   **AI Model:** Google Gemini 3.1 Flash API

---

## 📸 Screenshots

*(Replace the placeholder URLs with actual screenshot links)*

### Dashboard / Cockpit View
https://github.com/sadia-ai-dev/TravixIQ/blob/main/Screenshot_20260728_001256%20(1).jpg

### AI Travel Planner
https://github.com/sadia-ai-dev/TravixIQ/blob/main/Screenshot_20260728_001249%20(1).jpg




### Scam Shield Security Deck
https://github.com/sadia-ai-dev/TravixIQ/blob/main/Screenshot_20260728_001228%20(1).jpg




---

## 🚀 How to Run the Project (Installation Guide)

Follow these step-by-step instructions to get the project running on your local machine:

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd TravixIQ-ai
```

### 2. Install Dependencies
Install all required packages for both the frontend and backend setup.
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of your project and configure your Google Gemini API key:
```bash
touch .env
```
Inside the `.env` file, add:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Development Server
Run the application using the designated development script:
```bash
npm run dev
```

The frontend application and the backend API proxy will spin up concurrently, typically accessible via `http://localhost:3000`.
