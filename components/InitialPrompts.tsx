
import React from 'react';
import { INITIAL_PROMPTS } from '../constants';

interface InitialPromptsProps {
  onPromptClick: (prompt: string) => void;
}

const InitialPrompts: React.FC<InitialPromptsProps> = ({ onPromptClick }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm font-semibold text-gray-600 mb-3">Hoặc thử một trong các gợi ý sau:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {INITIAL_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-all text-sm text-gray-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InitialPrompts;
