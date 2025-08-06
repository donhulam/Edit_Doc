
import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ChatMessage, MessageRole } from '../types';
import LoadingSpinner from './LoadingSpinner';

/**
 * Loại bỏ các ký tự Markdown phổ biến khỏi văn bản để hiển thị và sao chép sạch hơn.
 * @param text - Chuỗi văn bản có chứa Markdown.
 * @returns Chuỗi văn bản đã được làm sạch.
 */
const removeMarkdown = (text: string): string => {
  if (!text) return '';
  
  let cleanedText = text;

  // Loại bỏ tiêu đề (ví dụ: #, ##)
  cleanedText = cleanedText.replace(/^#+\s+/gm, '');

  // Loại bỏ in đậm, in nghiêng, gạch ngang nhưng giữ lại nội dung
  cleanedText = cleanedText.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleanedText = cleanedText.replace(/(\*|_)(.*?)\1/g, '$2');
  cleanedText = cleanedText.replace(/~~(.*?)~~/g, '$1');

  // Loại bỏ các dấu của danh sách (ví dụ: *, -, +)
  cleanedText = cleanedText.replace(/^\s*[-*+]\s+/gm, '');

  // Loại bỏ trích dẫn khối (>)
  cleanedText = cleanedText.replace(/^>\s+/gm, '');

  // Loại bỏ định dạng mã nội tuyến (inline code)
  cleanedText = cleanedText.replace(/`([^`]+)`/g, '$1');

  // Loại bỏ các khối mã (code blocks)
  cleanedText = cleanedText.replace(/^```[a-z]*\n/gm, '');
  cleanedText = cleanedText.replace(/\n```/gm, '');

  // Loại bỏ liên kết nhưng giữ lại văn bản hiển thị: [văn bản](url) -> văn bản
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  return cleanedText;
};


interface MessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

const UserIcon: React.FC = () => (
  <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white flex-shrink-0">
    <i className="fas fa-user"></i>
  </div>
);

const BotIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
      <i className="fas fa-robot"></i>
    </div>
);

const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === MessageRole.USER;
  const [isCopied, setIsCopied] = useState(false);

  // Chỉ làm sạch văn bản của bot
  const cleanedText = isUser ? message.text : removeMarkdown(message.text);

  const handleCopy = () => {
    if (!cleanedText) return;
    navigator.clipboard.writeText(cleanedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Không thể sao chép văn bản: ', err);
      alert('Không thể sao chép văn bản.');
    });
  };

  const handleDownloadDocx = () => {
    if (!cleanedText) return;

    const paragraphs = cleanedText.split('\n').map(
        line => new Paragraph({ children: [new TextRun(line)] })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    Packer.toBlob(doc).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'van-ban-soan-thao.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }).catch(err => {
        console.error("Không thể tạo tệp .docx: ", err);
        alert("Đã có lỗi xảy ra khi tạo tệp .docx.");
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-start space-x-3">
        <div className="max-w-xl p-4 bg-blue-500 text-white rounded-xl rounded-br-none">
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        <UserIcon />
      </div>
    );
  }

  // Tin nhắn của Bot
  return (
    <div className="flex justify-start items-start space-x-3">
      <BotIcon />
      <div className="max-w-4xl w-full flex flex-col bg-white rounded-xl rounded-bl-none shadow-sm border border-gray-200">
        <div className="p-4 text-gray-800">
          {isLoading && !message.text ? (
            <div className="min-h-[24px] flex items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{cleanedText}</p>
          )}
        </div>
        
        {message.text && !isLoading && (
          <div className="border-t border-gray-200 px-3 py-2">
            <div className="flex justify-end items-center space-x-2">
              <button
                onClick={handleDownloadDocx}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                aria-label="Tải xuống .DOCX"
                title="Tải xuống .DOCX"
              >
                <i className="fas fa-file-word mr-2"></i>
                <span>Tải xuống DOCX</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                aria-label={isCopied ? "Đã sao chép" : "Sao chép nội dung"}
                title={isCopied ? "Đã sao chép!" : "Sao chép"}
              >
                {isCopied ? (
                  <>
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-copy mr-2"></i>
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
