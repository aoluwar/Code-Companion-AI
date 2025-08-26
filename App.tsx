import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Language, ChatMessage, Role, View } from './types';
import { SYSTEM_PROMPTS, DOCS_CONTENT } from './constants';

// --- SVG Icon Components ---

const PythonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.22,3.34C13.88,3.12 13.49,3 13.1,3H9.9C9.24,3 8.7,3.54 8.7,4.2V8.49L10.84,9.63C11.08,9.75 11.2,10 11.2,10.28V10.5C11.2,10.89 10.89,11.2 10.5,11.2H7.8C7.41,11.2 7.1,10.89 7.1,10.5V7.1C7.1,6.82 7.22,6.55 7.46,6.43L9.6,5.29V4.2C9.6,4.15 9.75,4.1 9.8,4.15L13.1,6.1C13.15,6.13 13.17,6.17 13.17,6.22V9.5C13.17,9.89 12.86,10.2 12.47,10.2H9.8C9.41,10.2 9.1,9.89 9.1,9.5V7.47L8.2,7.99V10.5C8.2,11.33 8.87,12.1 9.7,12.1H10.5C10.89,12.1 11.2,12.41 11.2,12.8V13.02C11.2,13.29 11.08,13.56 10.84,13.68L8.7,14.82V19.8C8.7,20.46 9.24,21 9.9,21H13.1C13.5,21 13.88,20.88 14.22,20.66C14.56,20.44 14.82,20.12 14.93,19.74L16.03,16.22C16.1,16.03 16.04,15.81 15.89,15.66L14.41,14.18C14.26,14.03 14.03,13.97 13.84,14.04L10.43,15.15C10.06,15.28 9.8,14.94 9.92,14.57L10.8,11.8C10.87,11.58 11.06,11.41 11.28,11.36L13.8,10.8C14.19,10.72 14.5,11.03 14.5,11.43V13.8C14.5,14.19 14.81,14.5 15.2,14.5H16.5C17.33,14.5 18,13.83 18,13V8.8C18,8.38 17.78,8.02 17.42,7.84L14.22,3.34Z" /></svg>
);

const RustIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M11.3,16.2L9.4,12.6L11,12.7C11.4,12.7 11.8,12.4 11.8,12C11.8,11.6 11.5,11.3 11.1,11.3H7.9C7.5,11.3 7.2,11.6 7.2,12C7.2,12.4 7.5,12.7 7.9,12.7H9L7.1,16.2C6.9,16.6 7.2,17.1 7.6,17.1H8.6C8.9,17.1 9.2,16.9 9.3,16.6L10.5,14.5L11.7,16.6C11.8,16.9 12.1,17.1 12.4,17.1H13.4C13.8,17.1 14.1,16.6 13.9,16.2L12,12.6L13.6,12.7C14,12.7 14.3,12.4 14.3,12C14.3,11.6 14,11.3 13.6,11.3H10.4C10,11.3 9.7,11.6 9.7,12C9.7,12.4 10,12.7 10.4,12.7H12L10.1,16.2L11.3,16.2M17,10H15V8H17V10M17,12H15V14H17V12M17,6H15V7H17V6Z" /></svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
);

// --- Child Components ---

interface HeaderProps {
    view: View;
    setView: (view: View) => void;
}
const Header: React.FC<HeaderProps> = ({ view, setView }) => {
    const navItemClasses = (currentView: View) =>
        `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            view === currentView ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                <div className="bg-sky-500 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">Code Companion AI</h1>
            </div>
            <nav className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setView('chat')} className={navItemClasses('chat')}>Agent Chat</button>
                <button onClick={() => setView('docs')} className={navItemClasses('docs')}>Developer Docs</button>
            </nav>
        </header>
    );
};

const DocsWindow: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-800"
                 dangerouslySetInnerHTML={{ __html: DOCS_CONTENT }}
            />
        </div>
    );
};

interface CodeBlockProps {
    language: string;
    code: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    return (
        <div className="bg-gray-950 rounded-lg my-4 border border-gray-700">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-lg">
                <span className="text-sm font-mono text-gray-400">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                    aria-label="Copy code to clipboard"
                >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code className={`language-${language}`}>{code}</code></pre>
        </div>
    );
};

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)\n```/g;
    const parts = content.split(codeBlockRegex);

    return (
        <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-200">
            {parts.map((part, index) => {
                if (index % 3 === 2) { // This is the code content
                    const language = parts[index - 1] || 'plaintext';
                    return <CodeBlock key={index} language={language} code={part.trim()} />;
                } else if (index % 3 === 0) { // This is the text content
                    return <p key={index} style={{whiteSpace: 'pre-wrap'}}>{part}</p>;
                }
                return null; // This is the language part, already used
            })}
        </div>
    );
}

interface LanguageSelectorProps {
    language: Language;
    setLanguage: (language: Language) => void;
}
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
    const btnClasses = (lang: Language) => `flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        language === lang ? 'bg-sky-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
    return (
        <div className="flex justify-center p-4 bg-gray-900 border-b border-gray-800">
            <div className="flex space-x-3 p-1 bg-gray-800 rounded-xl">
                <button onClick={() => setLanguage('python')} className={btnClasses('python')} aria-pressed={language === 'python'}>
                    <PythonIcon className="w-5 h-5" />
                    <span>Python</span>
                </button>
                <button onClick={() => setLanguage('rust')} className={btnClasses('rust')} aria-pressed={language === 'rust'}>
                    <RustIcon className="w-5 h-5" />
                    <span>Rust</span>
                </button>
            </div>
        </div>
    );
};

interface ChatWindowProps {
    language: Language;
    setLanguage: (language: Language) => void;
    messages: ChatMessage[];
    isLoading: boolean;
    agentIcon: React.ReactNode;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    handleSendMessage: (e: React.FormEvent) => Promise<void>;
    input: string;
    setInput: (value: string) => void;
    agentName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    language,
    setLanguage,
    messages,
    isLoading,
    agentIcon,
    messagesEndRef,
    handleSendMessage,
    input,
    setInput,
    agentName,
}) => (
    <div className="flex flex-col h-full">
        <LanguageSelector language={language} setLanguage={setLanguage} />
        <div className="flex-grow p-4 md:p-6 overflow-y-auto" aria-live="polite">
            <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">{agentIcon}</div>}
                        <div className={`max-w-xl p-4 rounded-xl shadow-md ${msg.role === 'user' ? 'bg-sky-700 text-white' : 'bg-gray-800 text-gray-200'}`}>
                           <MessageContent content={msg.content} />
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">{agentIcon}</div>
                        <div className="max-w-xl p-4 rounded-xl shadow-md bg-gray-800 text-gray-400">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-0"></span>
                                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-200"></span>
                                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse delay-400"></span>
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
        </div>
         <div className="p-4 bg-gray-900 border-t border-gray-800">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
                <label htmlFor="chat-input" className="sr-only">Type your message to {agentName}</label>
                <input
                    id="chat-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask ${agentName} anything about ${language}...`}
                    disabled={isLoading}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 transition-shadow"
                    autoComplete="off"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-sky-600 text-white p-3 rounded-lg hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500" aria-label="Send message">
                    <SendIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
    const [view, setView] = useState<View>('chat');
    const [language, setLanguage] = useState<Language>('python');
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const aiRef = useRef<GoogleGenAI | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const agentName = language === 'python' ? 'The Python Guy' : 'The Rust Guy';
    const agentIcon = language === 'python' ?
        <PythonIcon className="w-8 h-8 text-sky-400" /> :
        <RustIcon className="w-8 h-8 text-orange-500" />;

    useEffect(() => {
        if (!process.env.API_KEY) {
            console.error("API_KEY is not set.");
            alert("API key is missing. Please configure the process.env.API_KEY environment variable.");
            return;
        }
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);

    useEffect(() => {
        if (!aiRef.current) return;

        const newChat = aiRef.current.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_PROMPTS[language],
            },
        });
        setChat(newChat);
        setMessages([{ role: 'model', content: `Hello! I'm ${agentName}. How can I help you with ${language} today?` }]);
        setIsLoading(false);
        setInput('');

    }, [language, agentName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', content: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, chat]);

    return (
        <div className="h-screen flex flex-col bg-gray-950 font-sans">
            <Header view={view} setView={setView} />
            <main className="flex-grow overflow-hidden">
                {view === 'chat' ? (
                    <ChatWindow
                        language={language}
                        setLanguage={setLanguage}
                        messages={messages}
                        isLoading={isLoading}
                        agentIcon={agentIcon}
                        messagesEndRef={messagesEndRef}
                        handleSendMessage={handleSendMessage}
                        input={input}
                        setInput={setInput}
                        agentName={agentName}
                    />
                ) : (
                    <DocsWindow />
                )}
            </main>
        </div>
    );
};

export default App;