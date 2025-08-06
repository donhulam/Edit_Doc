
import React, { useState } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import GuideModal from './components/GuideModal';
import { initializeChat } from './services/geminiService';

const App: React.FC = () => {
  const [chatKey, setChatKey] = useState(Date.now());
  const [showGuide, setShowGuide] = useState(false);

  const handleNewTask = () => {
    // Reset the backend chat session with Gemini
    initializeChat();
    // Reset the frontend ChatInterface component by changing its key
    setChatKey(Date.now());
  };

  const handleShowGuide = () => setShowGuide(true);
  const handleCloseGuide = () => setShowGuide(false);

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header onNewTask={handleNewTask} onShowGuide={handleShowGuide} />
      <main className="flex-1 overflow-hidden">
        <ChatInterface key={chatKey} />
      </main>
      <Footer />
      <GuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    </div>
  );
};

export default App;
