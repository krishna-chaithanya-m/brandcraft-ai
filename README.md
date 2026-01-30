
# ⚡ BrandCraft AI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Gemini](https://img.shields.io/badge/AI-Gemini%20Pro-orange)

**BrandCraft AI** is a comprehensive, Generative AI-powered branding automation platform designed for startups, creators, and agencies. It leverages Google's advanced **Gemini 3 Pro** and **Gemini 2.5 Flash** models to automate the creation of visual identities, strategic messaging, and marketing content.

## 🌟 Features

### 🎯 Identity Builder
*   **Name Generation**: Generate creative, industry-specific brand names with meaning analysis using Gemini Flash.
*   **Brand Strategy**: Auto-generate Mission, Vision, and Core Values based on your brand description using the reasoning power of Gemini 3 Pro.

### 🎨 Visual Lab (Logo Generator)
*   **AI Logo Design**: Create vector-style minimalist logos based on style presets (Modern, Abstract, Geometric, etc.).
*   **Color Refinement**: Use Image-to-Image capabilities to recolor logos while preserving geometry.
*   **Visual Presets**: Choose from curated artistic styles like "Cyberpunk", "Vintage", or "Futuristic".

### ✍️ Content Studio
*   **Marketing Copy**: Generate high-conversion slogans, social media captions, and email campaigns.
*   **Tone of Voice**: Customize output tone (Professional, Playful, Luxury).

### 📊 Sentiment Hub
*   **Emotion Analysis**: Analyze customer feedback using NLP to extract emotional metrics (Joy, Trust, Fear, Surprise).
*   **Visualization**: View sentiment breakdowns on an interactive Radar chart.

### 🤖 Brand Assistant
*   **Context-Aware Chat**: A persistent AI consultant that knows your specific project details (Name, Industry, Strategy) and provides tailored advice.

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI SDK**: Google GenAI SDK (`@google/genai`)
*   **Icons**: Lucide React
*   **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google Cloud Project with Gemini API access enabled.
*   An API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/brandcraft-ai.git
    cd brandcraft-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key
    ```
    *Note: This application is configured to use `process.env.API_KEY` for secure API access.*

4.  **Run the development server**
    ```bash
    npm start
    ```

## 📂 Project Structure

```
brandcraft-ai/
├── src/
│   ├── components/      # Reusable UI components (Sidebar, Loader, etc.)
│   ├── pages/           # Main application views (Dashboard, Identity, Visuals...)
│   ├── services/        # API integrations (Gemini AI service, Auth)
│   ├── types.ts         # TypeScript interfaces
│   ├── App.tsx          # Main router and layout
│   └── index.tsx        # Entry point
├── public/
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Disclaimer**: This project uses Generative AI. Output accuracy and uniqueness can vary. Always review AI-generated content before commercial use.
