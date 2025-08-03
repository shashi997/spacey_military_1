import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Lightbulb, Rocket, Target, Zap } from 'lucide-react';
import smartProfileSystem, { BEHAVIOR_CATEGORIES, TRAIT_DEFINITIONS } from '../../utils/smartProfileSystem';
import useSmartProfile from '../../hooks/useSmartProfile';

const SmartProfileDemo = ({ userId, lessonId = 'demo' }) => {
  const [profileData, setProfileData] = useState(null);
  const [selectedBehavior, setSelectedBehavior] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [behaviorHistory, setBehaviorHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    trackBehavior, 
    trackRiskTaking, 
    trackCaution, 
    trackScientificThinking,
    trackCollaboration,
    trackCuriosity,
    trackAnalytical,
    trackLeadership,
    trackCreativity,
    trackPersistence,
    trackAdaptability,
    completeMission
  } = useSmartProfile(userId, lessonId);

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const loadProfileData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const summary = await smartProfileSystem.generateProfileSummary(userId);
      setProfileData(summary);
      
      // Load behavior history
      const history = await smartProfileSystem.getBehaviorHistory(userId, 10);
      setBehaviorHistory(history);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackBehavior = async (category, action) => {
    if (!userId) {
      alert('Please log in to test the Smart Profile System');
      return;
    }

    try {
      trackBehavior(category, action, 'demo');
      await loadProfileData(); // Refresh data
      alert(`Tracked behavior: ${category} - ${action}`);
    } catch (error) {
      console.error('Error tracking behavior:', error);
      alert('Error tracking behavior');
    }
  };

  const handleCustomBehavior = async () => {
    if (!selectedBehavior || !customAction) {
      alert('Please select a behavior category and enter an action');
      return;
    }

    await handleTrackBehavior(selectedBehavior, customAction);
    setCustomAction('');
  };

  const handleCompleteMission = async () => {
    if (!userId) {
      alert('Please log in to test mission completion');
      return;
    }

    try {
      const completionData = {
        demo: true,
        behaviors: behaviorHistory.length,
        completedAt: new Date().toISOString()
      };
      
      await completeMission(completionData);
      await loadProfileData();
      alert('Mission completed! Check your profile for updates.');
    } catch (error) {
      console.error('Error completing mission:', error);
      alert('Error completing mission');
    }
  };

  const behaviorExamples = {
    [BEHAVIOR_CATEGORIES.RISK_TAKING]: [
      'chose risky option',
      'took bold approach',
      'pushed limits',
      'experimented freely'
    ],
    [BEHAVIOR_CATEGORIES.CAUTION]: [
      'chose safe option',
      'avoided risk',
      'followed protocol',
      'took time to plan'
    ],
    [BEHAVIOR_CATEGORIES.SCIENTIFIC_THINKING]: [
      'asked how it works',
      'researched mechanism',
      'analyzed data',
      'sought evidence'
    ],
    [BEHAVIOR_CATEGORIES.COLLABORATION]: [
      'asked for help',
      'worked with team',
      'shared resources',
      'sought input'
    ],
    [BEHAVIOR_CATEGORIES.CURIOSITY]: [
      'asked questions',
      'wanted to learn more',
      'explored options',
      'investigated further'
    ],
    [BEHAVIOR_CATEGORIES.ANALYTICAL]: [
      'analyzed options',
      'compared choices',
      'weighed pros and cons',
      'calculated risks'
    ],
    [BEHAVIOR_CATEGORIES.LEADERSHIP]: [
      'took initiative',
      'guided others',
      'made decisions',
      'took responsibility'
    ],
    [BEHAVIOR_CATEGORIES.CREATIVITY]: [
      'innovative solution',
      'creative approach',
      'outside the box',
      'unconventional method'
    ],
    [BEHAVIOR_CATEGORIES.PERSISTENCE]: [
      'kept trying',
      'didn\'t give up',
      'persevered through difficulty',
      'tried multiple approaches'
    ],
    [BEHAVIOR_CATEGORIES.ADAPTABILITY]: [
      'changed approach',
      'adapted to new information',
      'flexible thinking',
      'adjusted strategy'
    ]
  };

  const getTraitDisplayData = () => {
    if (!profileData?.traits) return [];
    
    return Object.entries(profileData.traits)
      .map(([traitKey, score]) => {
        const traitDef = TRAIT_DEFINITIONS[traitKey];
        return {
          key: traitKey,
          label: traitDef?.label || traitKey,
          color: traitDef?.color || 'bg-gray-400',
          score: score || 0,
          description: traitDef?.description || ''
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const traitDisplayData = getTraitDisplayData();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          Smart Profile System Demo
        </h1>
        <p className="text-gray-300 text-lg">
          Test the evolving trait system that tracks your behavior and provides personalized feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Profile */}
        <div className="bg-black/20 rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
            <Brain className="text-cyan-400" />
            Current Profile
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : profileData ? (
            <div className="space-y-4">
              {/* Feedback */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
                <p className="text-blue-200 italic">"{profileData.feedback}"</p>
              </div>
              
              {/* Traits */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Your Traits</h3>
                {traitDisplayData.map(({ key, label, color, score }) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-gray-300">{label}</span>
                    <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`${color} h-3 rounded-full transition-all`}
                        style={{ width: `${Math.min(score * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No profile data available</p>
          )}
        </div>

        {/* Behavior Tracking */}
        <div className="bg-black/20 rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <Target className="text-purple-400" />
            Track Behavior
          </h2>
          
          <div className="space-y-4">
            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTrackBehavior(BEHAVIOR_CATEGORIES.RISK_TAKING, 'chose risky option')}
                  className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded border border-yellow-500/30 text-yellow-200 text-sm"
                >
                  Risk Taking
                </button>
                <button
                  onClick={() => handleTrackBehavior(BEHAVIOR_CATEGORIES.CAUTION, 'chose safe option')}
                  className="p-2 bg-cyan-600/20 hover:bg-cyan-600/30 rounded border border-cyan-500/30 text-cyan-200 text-sm"
                >
                  Caution
                </button>
                <button
                  onClick={() => handleTrackBehavior(BEHAVIOR_CATEGORIES.SCIENTIFIC_THINKING, 'asked how it works')}
                  className="p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded border border-purple-500/30 text-purple-200 text-sm"
                >
                  Scientific
                </button>
                <button
                  onClick={() => handleTrackBehavior(BEHAVIOR_CATEGORIES.COLLABORATION, 'asked for help')}
                  className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded border border-green-500/30 text-green-200 text-sm"
                >
                  Collaboration
                </button>
              </div>
            </div>

            {/* Custom Behavior */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Custom Behavior</h3>
              <div className="space-y-3">
                <select
                  value={selectedBehavior}
                  onChange={(e) => setSelectedBehavior(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="">Select behavior category</option>
                  {Object.entries(BEHAVIOR_CATEGORIES).map(([key, value]) => (
                    <option key={value} value={value}>{key.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  placeholder="Enter your action..."
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
                <button
                  onClick={handleCustomBehavior}
                  className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold"
                >
                  Track Custom Behavior
                </button>
              </div>
            </div>

            {/* Mission Completion */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Mission Actions</h3>
              <button
                onClick={handleCompleteMission}
                className="w-full p-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded text-white font-semibold flex items-center justify-center gap-2"
              >
                <Rocket className="text-white" />
                Complete Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Behavior Examples */}
      <div className="bg-black/20 rounded-2xl border border-white/10 p-6">
        <h2 className="text-2xl font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Zap className="text-orange-400" />
          Behavior Examples
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(behaviorExamples).map(([category, examples]) => (
            <div key={category} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                {category.replace(/_/g, ' ').toUpperCase()}
              </h3>
              <div className="space-y-1">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrackBehavior(category, example)}
                    className="block w-full text-left p-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavior History */}
      {behaviorHistory.length > 0 && (
        <div className="bg-black/20 rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-green-300 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-400" />
            Recent Behavior History
          </h2>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {behaviorHistory.map((behavior, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                <span className="text-xs text-gray-400 w-20">{behavior.category}</span>
                <span className="text-sm text-white flex-1">{behavior.action}</span>
                <span className="text-xs text-gray-500">
                  {new Date(behavior.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartProfileDemo; 