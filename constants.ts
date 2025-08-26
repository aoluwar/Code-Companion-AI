export const SYSTEM_PROMPTS = {
    python: "You are The Python Guy, a world-class expert AI assistant specializing in Python. You are friendly, helpful, and an exceptional educator. Provide clear, concise, and accurate answers. Always include best practices and idiomatic Python code examples where applicable. Format your responses using markdown.",
    rust: "You are The Rust Guy, a world-class expert AI assistant specializing in the Rust programming language. You are precise, thorough, and an exceptional educator. Provide clear, concise, and accurate answers. Emphasize safety, performance, and concurrency, which are core tenets of Rust. Always include idiomatic Rust code examples. Format your responses using markdown.",
};

export const DOCS_CONTENT = `
<h1 class="text-4xl font-bold text-gray-50 mb-6 border-b border-gray-700 pb-4">Code Companion AI - Documentation</h1>

<div class="space-y-8">
  <div>
    <h2 class="text-2xl font-semibold text-sky-400 mb-3">Creator</h2>
    <p class="text-gray-300">This application was coded by <a href="https://github.com/deethecreator" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline">deethecreator</a>.</p>
  </div>

  <div>
    <h2 class="text-2xl font-semibold text-sky-400 mb-3">For Developers</h2>
    <div class="prose prose-invert prose-lg text-gray-300 space-y-4">
      <h3 class="text-xl font-medium text-gray-100">Overview</h3>
      <p>Code Companion AI is a specialized chat agent designed to assist developers with Python and Rust programming. It leverages the Google Gemini API to provide expert-level answers, code examples, and explanations.</p>
      
      <h3 class="text-xl font-medium text-gray-100">Tech Stack</h3>
      <ul>
        <li><strong>React 18</strong> with TypeScript</li>
        <li><strong>Tailwind CSS</strong> for styling</li>
        <li><strong>@google/genai</strong> for the Gemini API integration</li>
      </ul>

      <h3 class="text-xl font-medium text-gray-100">Project Structure</h3>
      <p>The application is built with a minimal file structure for simplicity and clarity:</p>
      <ul>
        <li><code>App.tsx</code>: The main file containing all UI components (Header, Chat, Docs) and application logic.</li>
        <li><code>types.ts</code>: Contains all TypeScript type definitions.</li>
        <li><code>constants.ts</code>: Stores static data like system prompts and documentation content.</li>
        <li><code>index.tsx</code>: The React application entry point.</li>
      </ul>

      <h3 class="text-xl font-medium text-gray-100">API Usage</h3>
      <p>The agent uses the <code>@google/genai</code> library's chat functionality. A new chat session is created via <code>ai.chats.create()</code> whenever the user switches languages. This session is primed with a language-specific system instruction to create the 'The Python Guy' or 'The Rust Guy' persona. User messages are sent using <code>chat.sendMessageStream()</code> to provide a real-time, streaming response.</p>
      <pre class="bg-gray-900 p-4 rounded-lg"><code class="language-typescript">const chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: SYSTEM_PROMPTS[language],
  },
});</code></pre>

      <h3 class="text-xl font-medium text-gray-100">Environment Setup</h3>
      <p>To run this application, an environment variable named <code>process.env.API_KEY</code> must be configured with a valid Google Gemini API key. The application reads this key directly to initialize the GenAI client.</p>
    </div>
  </div>

  <div>
    <h2 class="text-2xl font-semibold text-sky-400 mb-3">For AI Agents</h2>
    <div class="prose prose-invert prose-lg text-gray-300 space-y-4">
      <h3 class="text-xl font-medium text-gray-100">Purpose</h3>
      <p>Your primary function is to serve as a specialized coding assistant for Python and Rust. You must embody the persona defined in your system prompt to provide a consistent and helpful user experience.</p>
      
      <h3 class="text-xl font-medium text-gray-100">Capabilities</h3>
      <ul>
        <li>Answer technical questions about Python and Rust syntax, libraries, and concepts.</li>
        <li>Generate idiomatic code examples to solve specific problems.</li>
        <li>Explain complex topics in a clear and understandable manner.</li>
        <li>Assist with debugging by analyzing code snippets and suggesting fixes.</li>
      </ul>

      <h3 class="text-xl font-medium text-gray-100">Interaction Protocol</h3>
      <ul>
        <li>You will be initialized with a system prompt that establishes your persona (The Python Guy for Python, The Rust Guy for Rust). Adhere to this persona in all responses.</li>
        <li>You will receive user queries as text messages within a chat session.</li>
        <li>Your responses <strong>must</strong> be formatted in Markdown. This is critical for the UI to correctly render text, lists, and code blocks.</li>
        <li>Enclose all code snippets in triple backticks, specifying the language (e.g., <code>\`\`\`python</code> or <code>\`\`\`rust</code>).</li>
      </ul>

      <h3 class="text-xl font-medium text-gray-100">Limitations</h3>
      <ul>
        <li>Each chat session is stateless and is re-initialized if the user switches the selected programming language. You do not retain memory of previous conversations across language changes.</li>
        <li>You do not have access to an external file system, cannot execute code, and cannot browse the internet in real-time. Your knowledge is based on the data you were trained on.</li>
      </ul>
    </div>
  </div>
</div>
`;