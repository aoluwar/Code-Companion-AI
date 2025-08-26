# Code Companion AI

An AI agent that provides expert coding assistance for Python and Rust. Ask questions, get code examples, and learn best practices from your AI pair programmer.

This application was coded by [deethecreator](https://github.com/deethecreator).

## Features

-   **Dual-Language Support**: Specialized AI personas for both Python ("The Python Guy") and Rust ("The Rust Guy").
-   **Streaming Responses**: Real-time message streaming for a responsive chat experience.
-   **Markdown & Code Rendering**: Full markdown support with syntax highlighting for code blocks.
-   **Copy-to-Clipboard**: Easily copy code snippets.
-   **Developer & AI Docs**: In-app documentation for developers and for understanding the AI's capabilities.
-   **Sleek UI**: A modern, dark-themed interface built with Tailwind CSS.

## Tech Stack

-   **React 18** with TypeScript
-   **Tailwind CSS** for styling
-   **@google/genai** for the Google Gemini API integration

## Project Structure

The application is built with a minimal file structure for simplicity and clarity:

-   `App.tsx`: The main file containing all UI components (Header, Chat, Docs) and application logic.
-   `types.ts`: Contains all TypeScript type definitions.
-   `constants.ts`: Stores static data like system prompts and documentation content.
-   `index.tsx`: The React application entry point.
-   `index.html`: The main HTML file.
-   `README.md`: This file.

## API Usage

The agent uses the `@google/genai` library's chat functionality. A new chat session is created via `ai.chats.create()` whenever the user switches languages. This session is primed with a language-specific system instruction to create the "The Python Guy" or "The Rust Guy" persona. User messages are sent using `chat.sendMessageStream()` to provide a real-time, streaming response.

```typescript
const chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: SYSTEM_PROMPTS[language],
  },
});
```

## Environment Setup

To run this application, an environment variable named `process.env.API_KEY` must be configured with a valid Google Gemini API key. The application reads this key directly to initialize the GenAI client.
