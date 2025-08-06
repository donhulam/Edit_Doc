import React from 'react';

interface HeaderProps {
  onNewTask: () => void;
  onShowGuide: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTask, onShowGuide }) => {
  return (
    <header className="bg-white shadow-md w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <i className="fas fa-file-alt text-2xl text-blue-600"></i>
            <h1 className="text-xl font-bold text-gray-800">
              TRỢ LÝ AI SOẠN THẢO VĂN BẢN
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onShowGuide}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Xem giới thiệu và hướng dẫn"
            >
              <i className="fas fa-info-circle"></i>
              <span>Giới thiệu & Hướng dẫn</span>
            </button>
            <button
              onClick={onNewTask}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Bắt đầu nhiệm vụ mới"
            >
              <i className="fas fa-plus"></i>
              <span>Nhiệm vụ mới</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;