import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

let genAI = null;

function getClient() {
    if (!genAI) {
        if (!API_KEY) {
            throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env.local file.');
        }
        genAI = new GoogleGenerativeAI(API_KEY);
    }
    return genAI;
}

/**
 * Check if input looks like a URL.
 */
export function isUrl(input) {
    const trimmed = input.trim();
    if (/^https?:\/\//i.test(trimmed)) return true;
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed) && !trimmed.includes(' ')) return true;
    return false;
}

/**
 * Normalize a URL — add https:// if missing.
 */
export function normalizeUrl(input) {
    const trimmed = input.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

/**
 * Ask Gemini a question and stream the response.
 * @param {string} prompt
 * @param {string} [context] - optional page context
 * @param {function} onChunk - called with each text chunk as it streams
 */
export async function askGemini(prompt, context = '', onChunk) {
    const client = getClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = context
        ? `You are Comet, an intelligent AI browsing assistant. The user is viewing a webpage with the following content:\n\n${context.slice(0, 8000)}\n\nAnswer the user's question based on this page context and your general knowledge. Use markdown formatting.`
        : `You are Comet, an intelligent AI browsing assistant built into a next-generation browser. Answer concisely and helpfully. Use markdown formatting for code and lists.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

    const result = await model.generateContentStream(fullPrompt);

    let fullText = '';
    for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        if (onChunk) onChunk(text, fullText);
    }

    return fullText;
}

/**
 * Read a page's DOM text and answer a question about it.
 */
export async function readPageAndAnswer(domText, question, onChunk) {
    return askGemini(question, domText, onChunk);
}
