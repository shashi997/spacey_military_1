import React, { useEffect, useState } from "react";
import axios from "axios";
import { Rocket, TrendingUp, Brain, Users, Lightbulb, Star, AlertCircle } from "lucide-react";
import smartProfileSystem, { TRAIT_DEFINITIONS } from "../../utils/smartProfileSystem";

// Use a more visually appealing avatar placeholder
const AVATAR_URL = "https://api.dicebear.com/7.x/adventurer/svg?seed=Spacey";

const PlayerProfile = ({
  userId,
  traits = {},
  missions = [],
  loading = false,
}) => {
  // Count completed missions
  const completedCount = missions.filter((m) => m.completed_at).length;
  const [traitFeedback, setTraitFeedback] = useState("");
  const [profileSummary, setProfileSummary] = useState(null);
  const [dominantTraits, setDominantTraits] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const loadProfileData = async () => {
    if (!userId) return;
    
    setIsLoadingProfile(true);
    try {
      console.log('Loading profile data for user:', userId);
      // Get comprehensive profile data
      const summary = await smartProfileSystem.generateProfileSummary(userId);
      console.log('Profile summary:', summary);
      
      // If no traits exist, initialize sample traits for testing
      if (!summary.traits || Object.keys(summary.traits).length === 0) {
        console.log('No traits found, initializing sample traits...');
        setIsUsingSampleData(true);
        await smartProfileSystem.initializeSampleTraits(userId);
        // Reload the summary after initialization
        const updatedSummary = await smartProfileSystem.generateProfileSummary(userId);
        setProfileSummary(updatedSummary);
        setDominantTraits(updatedSummary.dominantTraits);
        setTraitFeedback(updatedSummary.feedback);
      } else {
        setIsUsingSampleData(false);
        setProfileSummary(summary);
        setDominantTraits(updatedSummary.dominantTraits);
        setTraitFeedback(updatedSummary.feedback);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Fallback to API call
      try {
        const res = await axios.get(`/api/profile/traitFeedback/${userId}`);
        setTraitFeedback(res.data.feedback);
      } catch (apiError) {
        console.log('API fallback failed, using default message');
        setTraitFeedback("Your profile is still evolving.");
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Get trait display data
  const getTraitDisplayData = () => {
    const allTraits = profileSummary?.traits || traits;
    return Object.entries(allTraits)
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
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Show top 6 traits
  };

  const traitDisplayData = getTraitDisplayData();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
          Smart Profile Dashboard
        </h1>
        <p className="text-gray-300 text-lg">
          Your evolving personality traits and learning journey
        </p>
        
        {/* Sample Data Indicator */}
        {isUsingSampleData && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm">
              Showing sample data - Complete missions to see your real traits evolve!
            </span>
          </div>
        )}
      </div>

      {/* Spacey Dashboard Bar */}
      <div className="mb-8 flex justify-center">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg shadow-lg px-6 py-3 flex items-center justify-between min-w-[300px] max-w-md">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-white">Spacey Dashboard</span>
            {isUsingSampleData && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-900/30 border border-yellow-500/50 rounded text-xs">
                <AlertCircle className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-200">Sample</span>
              </div>
            )}
          </div>
          
          {/* Spacey Icon on the right */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-blue-300 shadow-sm">
            <Rocket className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl p-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Left Column - Avatar and Feedback */}
          <div className="xl:col-span-1">
            {/* Avatar Section */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-300 shadow-lg">
                  <img
                    src={AVATAR_URL}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Feedback Message */}
              <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <p className="text-blue-200 italic text-sm">
                  {isLoadingProfile ? "Analyzing your profile..." : traitFeedback}
                </p>
              </div>
            </div>

            {/* Mission Progress */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5 text-cyan-400" />
                Missions Completed
              </h3>
              <div className="flex justify-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 ${
                      i < completedCount
                        ? "bg-cyan-400 border-cyan-400"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-2xl font-bold text-cyan-400">{completedCount}</span>
            </div>

            {/* Top Three Traits */}
            {dominantTraits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Top Traits
                </h3>
                <div className="space-y-2">
                  {dominantTraits.slice(0, 3).map(({ trait, score }, index) => {
                    const traitDef = TRAIT_DEFINITIONS[trait];
                    return (
                      <div key={trait} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 w-4">#{index + 1}</span>
                          <div className={`w-3 h-3 rounded-full ${traitDef?.color || 'bg-gray-400'}`}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-200 flex-1">
                          {traitDef?.label || trait}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Traits */}
          <div className="xl:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Evolving Traits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {traitDisplayData.map(({ key, label, color, score, description }) => (
                <div key={key} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${color}`}></div>
                      <span className="text-lg font-semibold text-gray-200">{label}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{score}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
                    <div
                      className={`${color} h-4 rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(score * 10, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">{traitDisplayData.length}</div>
                <div className="text-sm text-gray-400">Active Traits</div>
              </div>
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(traitDisplayData.reduce((sum, trait) => sum + trait.score, 0) / traitDisplayData.length * 10) / 10}
                </div>
                <div className="text-sm text-gray-400">Avg Score</div>
              </div>
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{completedCount}</div>
                <div className="text-sm text-gray-400">Missions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {(loading || isLoadingProfile) && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-white text-lg">Loading profile...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerProfile;
