import React, { useState, useEffect } from 'react';
import { Shield, Star, Globe, Check, Loader, CornerDownLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useConversationManager } from '../../hooks/useConversationManager';

// --- Data for the interactive hotspots ---
const DOCTRINE_DATA = [
  {
    id: 'uk',
    name: 'UK Space Command',
    icon: <Shield size={50} className="text-blue-400" />,
    description: [
      'A joint command of the British Armed Forces, organized under the Royal Air Force.',
      'Staffed by personnel from the Royal Navy, British Army, and Royal Air Force.',
      'Focuses on three core pillars: protection, power projection, and innovation.'
    ]
  },
  {
    id: 'us',
    name: 'US Space Force',
    icon: <Star size={50} className="text-cyan-400" />,
    description: [
        "The United States Space Force (USSF) is the space force branch of the United States Department of Defense.",
        "It is one of the six armed forces of the United States.",
        "Operates specialized units, like Delta 5, which are responsible for constant space surveillance and tracking objects in orbit."
    ]
  },
  {
    id: 'nato',
    name: 'NATO Policy',
    icon: <Globe size={50} className="text-gray-400" />,
    description: [
        "The North Atlantic Treaty Organization (NATO) is a military alliance established in 1949 to provide collective security.",
        "The alliance's space policy states that a hostile attack on a member's satellite could trigger Article 5, the collective defense clause."
    ]
  }
];

// --- The Main Component ---
const DoctrineHotspots = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiPromptMessage, setAiPromptMessage] = useState('');

  const { currentUser } = useAuth();
  const { handleUserChat, isProcessing } = useConversationManager();

  const selectedDoctrine = DOCTRINE_DATA.find(d => d.id === selectedId);

  // Effect to trigger the AI's follow-up question
  useEffect(() => {
    if (selectedDoctrine) {
      setChatHistory([]); // Clear previous chat
      setAiPromptMessage(''); // Clear previous prompt
      
      const timer = setTimeout(async () => {
        const prompt = `As Spacey, the AI mission specialist, I've just presented the key points about the "${selectedDoctrine.name}". Now, ask the Commander if they have any follow-up questions about this specific doctrine.`;
        const response = await handleUserChat(prompt, currentUser);
        if (response?.message) {
          setAiPromptMessage(response.message);
        }
      }, 1000); // Wait a moment after selection before asking

      return () => clearTimeout(timer);
    }
  }, [selectedId]);


  const handleSelect = (id) => {
    setSelectedId(id);
    if (!completedIds.includes(id)) {
      setCompletedIds(prev => [...prev, id]);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!userInput.trim() || isProcessing || !selectedDoctrine) return;

    const query = userInput;
    const newHistory = [...chatHistory, { sender: 'user', content: query }];
    setChatHistory(newHistory);
    setUserInput('');

    const aiPrompt = `
      As Spacey, the AI mission specialist, the user is learning about the "${selectedDoctrine.name}".
      Their follow-up question is: "${query}".
      
      Provide a concise, informative answer in the style of a helpful tutor.
    `;

    const response = await handleUserChat(aiPrompt, currentUser);
    if (response?.message) {
      setChatHistory(prev => [...prev, { sender: 'ai', content: response.message }]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Allied Doctrine Snapshot</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Click an emblem to learn more and ask questions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {DOCTRINE_DATA.map((doctrine) => (
          <button
            key={doctrine.id}
            onClick={() => handleSelect(doctrine.id)}
            className={`relative p-6 flex flex-col items-center justify-center gap-4 rounded-lg border-2 transition-all duration-300 ${
              selectedId === doctrine.id 
                ? 'bg-white/10 border-cyan-400 scale-105' 
                : 'bg-white/5 border-transparent hover:border-white/20'
            }`}
          >
            {doctrine.icon}
            <span className="font-semibold text-white text-center text-lg">{doctrine.name}</span>
            {completedIds.includes(doctrine.id) && (
              <div className="absolute top-2 right-2 p-1 bg-green-500/20 rounded-full">
                <Check size={16} className="text-green-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Information & Chat Area */}
      <div className="w-full min-h-[250px] p-4 bg-black/30 rounded-lg flex flex-col">
        {!selectedDoctrine ? (
          <p className="m-auto text-gray-500 text-center">Select an emblem to learn more.</p>
        ) : (
          <div className="animate-fade-in w-full flex flex-col flex-grow">
            <div className="text-left text-gray-300 w-full mb-4">
              <ul className="space-y-2">
                {selectedDoctrine.description.map((point, index) => (
                  <li key={index} className="flex items-start text-lg">
                    <span className="text-cyan-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Chat History & AI Prompt */}
            <div className="space-y-2 flex-grow max-h-40 overflow-y-auto pr-2 mb-4">
              {aiPromptMessage && (
                <div className="text-sm p-2 rounded-lg bg-gray-700/50 text-left text-cyan-300 italic animate-fade-in">
                  {aiPromptMessage}
                </div>
              )}
              {chatHistory.map((msg, index) => (
                <div key={index} className={`text-sm p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600/30 text-right' : 'bg-gray-700/50 text-left'}`}>
                  {msg.content}
                </div>
              ))}
               {isProcessing && chatHistory.length > 0 && (
                <div className="text-sm p-2 rounded-lg bg-gray-700/50 text-left text-gray-400 italic">
                  Spacey is typing...
                </div>
              )}
            </div>

            {/* Input Field (only shows after AI has prompted) */}
            {aiPromptMessage && (
              <div className="relative mt-auto animate-fade-in">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()}
                  placeholder="Ask a follow-up question..."
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 pr-12 text-white placeholder-gray-500"
                  disabled={isProcessing}
                />
                <button onClick={handleQuestionSubmit} disabled={isProcessing || !userInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white disabled:opacity-50">
                  {isProcessing ? <Loader className="animate-spin" size={20}/> : <CornerDownLeft size={20}/>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DoctrineHotspots);
