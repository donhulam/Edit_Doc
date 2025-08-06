
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Assume process.env.API_KEY is configured in the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

let chat: Chat;

export function initializeChat() {
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
}

// Ensure chat is initialized before first use
initializeChat();

export interface FilePayload {
    data: string; // Base64 encoded string
    mimeType: string;
}

export interface SendMessageParams {
    message: string;
    files?: FilePayload[];
}

export const sendMessageStream = async (
  params: SendMessageParams,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    if (!chat) {
        initializeChat();
    }
    
    const { message, files } = params;

    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];

    // Add file parts first
    if (files && files.length > 0) {
        for (const file of files) {
            parts.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.data,
                },
            });
        }
    }
    
    // Then add the text part
    parts.push({ text: message });

    const result = await chat.sendMessageStream({ message: parts });
    for await (const chunk of result) {
      if(chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
    if (error instanceof Error) {
        errorMessage = `Lỗi: ${error.message}`;
    }
    onError(errorMessage);
  }
};