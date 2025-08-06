import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageStream, FilePayload } from '../services/geminiService';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';
import InitialPrompts from './InitialPrompts';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error('Failed to parse base64 data from file.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'initial-bot-message',
        role: MessageRole.BOT,
        text: 'Xin chào! Tôi là Trợ lý Soạn thảo Văn bản. Tôi có thể giúp bạn tạo các văn bản hành chính theo đúng quy định của pháp luật Việt Nam. Bạn cần hỗ trợ gì hôm nay?'
      }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const validFiles = newFiles.filter(f => allowedTypes.includes(f.type));
      const invalidFilesCount = newFiles.length - validFiles.length;

      if (invalidFilesCount > 0) {
        alert(`${invalidFilesCount} tệp không hợp lệ đã bị bỏ qua. Vui lòng chỉ chọn các tệp PDF, DOC, hoặc DOCX.`);
      }
      
      setFiles(prev => [...prev, ...validFiles]);
      
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleSendMessage = async (prompt?: string) => {
    const userProvidedText = (prompt || input).trim();
    if (!userProvidedText && files.length === 0) return;
    if (isLoading) return;

    const messageText = userProvidedText || (files.length > 0 ? 'Hãy phân tích và tóm tắt nội dung của các tệp này.' : '');
    if (!messageText) return;

    setIsLoading(true);
    setInput('');
    const currentFiles = [...files];
    setFiles([]);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      text: currentFiles.length > 0 ? `${messageText}\n\n*Tệp đính kèm: ${currentFiles.map(f => f.name).join(', ')}*` : messageText,
    };
    
    const botMessageId = `bot-${Date.now()}`;
    const botMessagePlaceholder: ChatMessage = {
      id: botMessageId,
      role: MessageRole.BOT,
      text: '',
    };
    
    setMessages(prev => [...prev, userMessage, botMessagePlaceholder]);

    let filePayloads: FilePayload[] | undefined;
    if (currentFiles.length > 0) {
        try {
            const base64Promises = currentFiles.map(fileToBase64);
            const base64Strings = await Promise.all(base64Promises);
            filePayloads = currentFiles.map((file, index) => ({
                data: base64Strings[index],
                mimeType: file.type
            }));
        } catch (error) {
            console.error('Lỗi đọc tệp:', error);
            const errorMessage = 'Đã xảy ra lỗi khi đọc tệp đính kèm. Vui lòng thử lại.';
            setMessages(prev => prev.map(msg => (msg.id === botMessageId ? { ...msg, text: errorMessage } : msg)));
            setIsLoading(false);
            return;
        }
    }

    await sendMessageStream(
      { message: messageText, files: filePayloads },
      (chunk) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      },
      (error) => {
         setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId ? { ...msg, text: error } : msg
          )
        );
      }
    );

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {messages.map((msg, index) => (
          <Message 
            key={msg.id} 
            message={msg} 
            isLoading={isLoading && index === messages.length - 1} 
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      
      {messages.length <= 1 && <InitialPrompts onPromptClick={handleSendMessage} />}

      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        {files.length > 0 && (
          <div className="max-w-4xl mx-auto pb-2">
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">
                  <div className="flex items-center space-x-2 overflow-hidden mr-2">
                      <i className="fas fa-file-alt flex-shrink-0"></i>
                      <span className="truncate" title={file.name}>{file.name}</span>
                  </div>
                  <button onClick={() => handleRemoveFile(file)} className="flex-shrink-0 text-blue-600 hover:text-blue-900" aria-label={`Bỏ tệp ${file.name}`}>
                    <i className="fas fa-times-circle"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="relative max-w-4xl mx-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập yêu cầu hoặc đính kèm tệp..."
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={isLoading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Đính kèm tệp"
          >
            <i className="fas fa-paperclip text-lg"></i>
          </button>
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!input && files.length === 0)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Gửi tin nhắn"
          >
            {isLoading ? <LoadingSpinner isButton={true}/> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;