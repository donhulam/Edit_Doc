
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-center p-3 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Phát triển bởi: {' '}
        <a 
          href="https://trolyai.io.vn/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-blue-600 hover:underline"
        >
          Đỗ Như Lâm
        </a>
      </p>
    </footer>
  );
};

export default Footer;
