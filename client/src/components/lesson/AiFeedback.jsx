// e:\Spacey-Intern\spacey_first_demo\spacey_demo_2\client\src\components\lesson\AiFeedback.jsx

import React from 'react';
import { Bot, SkipForward } from 'lucide-react';

const AiFeedback = ({ message, onContinue }) => {
  

  const handleContinueClick = () => {
    onContinue(); // Call the function to proceed to the next block
  };

  return (
    <div className="animate-fade-in p-4 rounded-lg bg-gray-900/50 border border-cyan-500/20 w-full">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
          <Bot size={28} className="text-white" />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="font-bold text-cyan-300 mb-2 text-lg">Spacey's Analysis</h4>
          <p className="text-gray-200 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end items-center gap-4">
        <button
          onClick={handleContinueClick}
          className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
        >
          <span>Continue</span>
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
};

export default AiFeedback;
