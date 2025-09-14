# Objection Builder 🚀

**Official Website:** [**https://objectionbuilder.netlify.app/**](https://objectionbuilder.netlify.app/)

An AI-powered application to help users generate well-structured, respectful, and effective counterarguments for various personal and professional scenarios. Based on user-provided context, target audience, and desired tone, it produces multiple response options with risk analysis and supporting evidence.

---

## ✨ Key Features

- **AI-Powered Generation**: Leverages the Google Gemini API to craft nuanced and intelligent counterarguments.
- **Deep Customization**: Tailor responses by defining the target audience, communication framework (e.g., NVC, SBI), emotional style, and tone intensity.
- **Conversational Context**: Engages in a back-and-forth conversation, maintaining context for follow-up responses.
- **Risk Analysis**: Each generated response includes an interpersonal risk assessment (`Low`, `Medium`, `High`) to help you choose the most appropriate option.
- **Logical Fallacy Detection**: Identifies potential logical fallacies in the original argument you are addressing.
- **Evidence-Based Support**: Automatically provides verifiable citations when the communication style calls for supporting evidence.
- **Bilingual Support**: Fully functional in both English and Chinese (中文).

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Model**: Google Gemini (`gemini-2.5-flash`) via `@google/genai`
- **Backend**: Netlify Functions (Serverless) for secure API key management
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🚀 Getting Started (Local Development)

To run this project locally, you will need the Netlify CLI to properly emulate the serverless function environment.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SpicyyMath/Objection_builder.git
    cd objection-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install and configure the Netlify CLI:**
    ```bash
    # Install the CLI globally
    npm install -g netlify-cli

    # Log in to your Netlify account
    netlify login

    # Link the project to your Netlify site
    netlify link
    ```

4.  **Create an environment variable file:**
    Create a new file named `.env` in the root of the project and add your Google Gemini API key:
    ```
    # .env
    API_KEY=your_google_gemini_api_key_here
    ```
    The Netlify CLI will automatically load this variable for local development.

5.  **Run the development server:**
    Use the Netlify CLI to start the development server, which runs both the Vite frontend and the serverless function emulator.
    ```bash
    netlify dev
    ```
    The application will be available at `http://localhost:8888`.

## 🌐 Deployment

This project is configured for continuous deployment with Netlify. Any push to the `main` branch on GitHub will automatically trigger a new build and deployment.

For the deployed version to work, you must set the `API_KEY` environment variable in the Netlify UI:

1.  Navigate to your site's dashboard on Netlify.
2.  Go to **Site configuration > Build & deploy > Environment**.
3.  Add a new **Environment variable** with the **Key** `API_KEY` and your Google Gemini API key as the **Value**.
4.  Trigger a new deploy to apply the variable.
