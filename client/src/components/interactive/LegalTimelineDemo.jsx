import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, Handshake, Check, FileText, Moon, CornerDownLeft, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Assuming path is correct
import { useConversationManager } from '../../hooks/useConversationManager'; // Assuming path is correct

// --- Data for the timeline events ---
const TREATY_DATA = [
  {
    id: 'ost',
    year: '1967',
    name: 'The Outer Space Treaty',
    icon: <Scale size={32} className="text-yellow-400" />,
    description: 'Prohibits placing weapons of mass destruction in orbit and limits the use of celestial bodies to peaceful purposes.'
  },
  {
    id: 'liability',
    year: '1972',
    name: 'The Liability Convention',
    icon: <ShieldCheck size={32} className="text-green-400" />,
    description: 'Establishes that launching states are absolutely liable to pay compensation for damage caused by their space objects.'
  },
  {
    id: 'registration',
    year: '1975',
    name: 'The Registration Convention',
    icon: <FileText size={32} className="text-orange-400" />,
    description: 'Requires launching states to maintain a registry of their space objects and report them to the United Nations.'
  },
  {
    id: 'moon',
    year: '1979',
    name: 'The Moon Agreement',
    icon: <Moon size={32} className="text-gray-400" />,
    description: 'Governs the activities of states on the Moon and other celestial bodies, stating they should be used exclusively for peaceful purposes.'
  },
  {
    id: 'artemis',
    year: '2020',
    name: 'The Artemis Accords',
    icon: <Handshake size={32} className="text-cyan-400" />,
    description: 'A set of non-binding principles to guide civil space exploration, emphasizing transparency, interoperability, and peaceful intent.'
  }
];

// --- The Main Component ---
const LegalTimelineDemo = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  const { currentUser } = useAuth();
  const { handleUserChat, isProcessing } = useConversationManager();

  const handleSelect = (id) => {
    setSelectedId(id);
    setChatHistory([]); // Reset chat when a new treaty is selected
    if (!completedIds.includes(id)) {
      setCompletedIds([...completedIds, id]);
    }
  };

  const selectedTreaty = TREATY_DATA.find(t => t.id === selectedId);

  const handleQuestionSubmit = async () => {
    if (!userInput.trim() || isProcessing || !selectedTreaty) return;

    const query = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { sender: 'user', content: query }]);

    const aiPrompt = `
      As Spacey, the AI mission specialist, the user has selected the "${selectedTreaty.name}" to discuss.
      Their question is: "${query}".
      
      Provide a concise, informative answer in the context of space law and military operations.
    `;

    const response = await handleUserChat(aiPrompt, currentUser);
    if (response?.message) {
      setChatHistory(prev => [...prev, { sender: 'ai', content: response.message }]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Legal & Ethical Framework</h2>
        <p className="font-mono text-sm text-gray-400 mt-2">Click on each event on the timeline to learn more or ask a question.</p>
      </div>

      {/* Timeline Visualization */}
      <div className="relative w-full h-20 mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 rounded-full"></div>
        <div className="relative flex justify-between w-full h-full">
          {TREATY_DATA.map((treaty) => (
            <div key={treaty.id} className="flex flex-col items-center">
              <button
                onClick={() => handleSelect(treaty.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  selectedId === treaty.id 
                    ? 'bg-cyan-500/20 border-cyan-400 scale-110' 
                    : 'bg-gray-800 border-gray-600 hover:border-cyan-500'
                }`}
              >
                {treaty.icon}
              </button>
              <span className="mt-2 font-mono text-sm text-gray-400">{treaty.year}</span>
              {completedIds.includes(treaty.id) && (
                <Check size={16} className="text-green-400 mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Information & Chat Display Area */}
      <div className="w-full min-h-[150px] p-4 bg-black/30 rounded-lg flex flex-col justify-between">
        {!selectedTreaty ? (
          <p className="text-gray-500 text-center self-center">Select a treaty from the timeline.</p>
        ) : (
          <div className="animate-fade-in w-full">
            <h3 className="text-xl font-bold text-white mb-2 text-center">{selectedTreaty.name}</h3>
            <p className="text-gray-300 text-center mb-4">{selectedTreaty.description}</p>
            
            {/* Chat History */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`text-sm p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600/30 text-right' : 'bg-gray-700/50 text-left'}`}>
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input Field */}
            <div className="relative mt-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()}
                placeholder={`Ask a question about the ${selectedTreaty.name}...`}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 pr-12 text-white placeholder-gray-500"
                disabled={isProcessing}
              />
              <button onClick={handleQuestionSubmit} disabled={isProcessing} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white">
                {isProcessing ? <Loader className="animate-spin" size={20}/> : <CornerDownLeft size={20}/>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LegalTimelineDemo);
