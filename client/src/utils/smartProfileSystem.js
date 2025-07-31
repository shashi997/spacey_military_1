// Smart Profile System - Tracks player behavior and provides evolving traits
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Behavior tracking categories
const BEHAVIOR_CATEGORIES = {
  RISK_TAKING: 'risk_taking',
  CAUTION: 'caution',
  SCIENTIFIC_THINKING: 'scientific_thinking',
  COLLABORATION: 'collaboration',
  CURIOSITY: 'curiosity',
  ANALYTICAL: 'analytical',
  LEADERSHIP: 'leadership',
  CREATIVITY: 'creativity',
  PERSISTENCE: 'persistence',
  ADAPTABILITY: 'adaptability'
};

// Behavior indicators for each category
const BEHAVIOR_INDICATORS = {
  [BEHAVIOR_CATEGORIES.RISK_TAKING]: {
    positive: [
      'chose risky option', 'took bold approach', 'pushed limits',
      'accepted challenge', 'went with gut feeling', 'tried untested method',
      'ignored warnings', 'took shortcut', 'experimented freely'
    ],
    negative: [
      'chose safe option', 'avoided risk', 'followed protocol',
      'took time to plan', 'asked for help', 'researched first'
    ]
  },
  [BEHAVIOR_CATEGORIES.CAUTION]: {
    positive: [
      'chose safe option', 'avoided risk', 'followed protocol',
      'took time to plan', 'asked for help', 'researched first',
      'double-checked', 'considered consequences', 'played it safe'
    ],
    negative: [
      'chose risky option', 'took bold approach', 'pushed limits',
      'ignored warnings', 'took shortcut', 'went with gut feeling'
    ]
  },
  [BEHAVIOR_CATEGORIES.SCIENTIFIC_THINKING]: {
    positive: [
      'asked how it works', 'researched mechanism', 'analyzed data',
      'formed hypothesis', 'tested theory', 'sought evidence',
      'questioned assumptions', 'sought scientific explanation',
      'wanted to understand physics', 'asked for technical details'
    ],
    negative: [
      'accepted without question', 'didn\'t care how it works',
      'ignored technical details', 'went with intuition only'
    ]
  },
  [BEHAVIOR_CATEGORIES.COLLABORATION]: {
    positive: [
      'asked for help', 'offered assistance', 'worked with team',
      'shared resources', 'sought input', 'valued others\' opinions',
      'helped teammate', 'supported group effort', 'asked for advice'
    ],
    negative: [
      'worked alone', 'ignored team input', 'refused help',
      'preferred solo approach', 'didn\'t share information'
    ]
  },
  [BEHAVIOR_CATEGORIES.CURIOSITY]: {
    positive: [
      'asked questions', 'wanted to learn more', 'explored options',
      'investigated further', 'sought additional information',
      'wanted to understand', 'asked why', 'explored unknown',
      'tried new approach', 'experimented'
    ],
    negative: [
      'accepted surface level', 'didn\'t ask questions',
      'avoided exploration', 'stuck to basics'
    ]
  },
  [BEHAVIOR_CATEGORIES.ANALYTICAL]: {
    positive: [
      'analyzed options', 'compared choices', 'weighed pros and cons',
      'calculated risks', 'systematic approach', 'logical reasoning',
      'data-driven decision', 'methodical thinking', 'evaluated carefully'
    ],
    negative: [
      'went with gut feeling', 'didn\'t analyze', 'impulsive decision',
      'ignored data', 'emotional choice'
    ]
  },
  [BEHAVIOR_CATEGORIES.LEADERSHIP]: {
    positive: [
      'took initiative', 'guided others', 'made decisions',
      'took responsibility', 'organized approach', 'led by example',
      'coordinated effort', 'took charge', 'provided direction'
    ],
    negative: [
      'followed others', 'avoided responsibility', 'waited for direction',
      'deferred to others', 'stayed in background'
    ]
  },
  [BEHAVIOR_CATEGORIES.CREATIVITY]: {
    positive: [
      'innovative solution', 'creative approach', 'outside the box',
      'unconventional method', 'artistic thinking', 'imaginative solution',
      'novel approach', 'unique perspective', 'creative problem solving'
    ],
    negative: [
      'conventional approach', 'standard solution', 'followed template',
      'traditional method', 'unimaginative choice'
    ]
  },
  [BEHAVIOR_CATEGORIES.PERSISTENCE]: {
    positive: [
      'kept trying', 'didn\'t give up', 'persevered through difficulty',
      'tried multiple approaches', 'stayed focused', 'overcame obstacles',
      'maintained effort', 'pushed through challenges'
    ],
    negative: [
      'gave up easily', 'switched to easier option', 'avoided difficulty',
      'quit when challenged', 'took shortcut'
    ]
  },
  [BEHAVIOR_CATEGORIES.ADAPTABILITY]: {
    positive: [
      'changed approach', 'adapted to new information', 'flexible thinking',
      'adjusted strategy', 'learned from mistakes', 'embraced change',
      'modified plan', 'responded to feedback'
    ],
    negative: [
      'stuck to original plan', 'ignored new information', 'rigid thinking',
      'refused to change', 'resisted adaptation'
    ]
  }
};

// Trait definitions with descriptions and feedback messages
const TRAIT_DEFINITIONS = {
  risk_taker: {
    label: 'Risk Taker',
    description: 'You tend to take calculated risks and embrace bold approaches',
    color: 'bg-yellow-400',
    feedback: [
      'You\'re not afraid to push boundaries and try new approaches!',
      'Your bold decision-making shows confidence in your abilities.',
      'You embrace challenges that others might find intimidating.',
      'Your willingness to take risks often leads to innovative solutions.'
    ]
  },
  cautious: {
    label: 'Cautious',
    description: 'You prefer careful, well-planned approaches',
    color: 'bg-cyan-400',
    feedback: [
      'Your careful planning ensures reliable and safe outcomes.',
      'You think through consequences before making decisions.',
      'Your methodical approach prevents costly mistakes.',
      'You value stability and predictability in your strategies.'
    ]
  },
  science_minded: {
    label: 'Science Minded',
    description: 'You have a strong interest in understanding how things work',
    color: 'bg-purple-400',
    feedback: [
      'Your curiosity about mechanisms drives deeper understanding.',
      'You seek evidence and logical explanations for phenomena.',
      'Your scientific approach leads to well-founded conclusions.',
      'You value empirical data over assumptions.'
    ]
  },
  collaborative: {
    label: 'Collaborative',
    description: 'You excel at working with others and building teams',
    color: 'bg-green-400',
    feedback: [
      'Your teamwork skills make you a valuable crew member.',
      'You understand that collaboration leads to better outcomes.',
      'Your willingness to help others strengthens the team.',
      'You recognize the power of collective effort.'
    ]
  },
  curious: {
    label: 'Curious',
    description: 'You have a natural desire to learn and explore',
    color: 'bg-orange-400',
    feedback: [
      'Your curiosity drives continuous learning and discovery.',
      'You ask insightful questions that lead to deeper understanding.',
      'Your exploration mindset uncovers new possibilities.',
      'You never stop seeking to understand the world around you.'
    ]
  },
  analytical: {
    label: 'Analytical',
    description: 'You use systematic thinking and data-driven approaches',
    color: 'bg-blue-400',
    feedback: [
      'Your logical analysis leads to well-reasoned decisions.',
      'You systematically evaluate options before choosing.',
      'Your data-driven approach ensures objective conclusions.',
      'You break down complex problems into manageable parts.'
    ]
  },
  leader: {
    label: 'Leader',
    description: 'You naturally take initiative and guide others',
    color: 'bg-red-400',
    feedback: [
      'Your leadership qualities inspire confidence in others.',
      'You take responsibility and guide teams toward success.',
      'Your initiative drives projects forward effectively.',
      'You naturally step up when direction is needed.'
    ]
  },
  creative: {
    label: 'Creative',
    description: 'You think outside the box and find innovative solutions',
    color: 'bg-pink-400',
    feedback: [
      'Your creative thinking leads to unique and effective solutions.',
      'You see possibilities that others might miss.',
      'Your innovative approach breaks through conventional barriers.',
      'You bring fresh perspectives to challenging problems.'
    ]
  },
  persistent: {
    label: 'Persistent',
    description: 'You don\'t give up easily and persevere through challenges',
    color: 'bg-indigo-400',
    feedback: [
      'Your determination ensures you overcome obstacles.',
      'You don\'t let setbacks discourage you from your goals.',
      'Your persistence leads to breakthrough moments.',
      'You maintain focus even when the going gets tough.'
    ]
  },
  adaptable: {
    label: 'Adaptable',
    description: 'You easily adjust to new situations and changing circumstances',
    color: 'bg-teal-400',
    feedback: [
      'Your flexibility allows you to thrive in changing environments.',
      'You quickly adapt strategies based on new information.',
      'Your open-mindedness helps you embrace new approaches.',
      'You learn from experience and adjust accordingly.'
    ]
  }
};

class SmartProfileSystem {
  constructor() {
    this.behaviorHistory = new Map();
    this.traitScores = new Map();
  }

  // Track a specific behavior during mission
  trackBehavior(userId, behaviorCategory, action, context = '') {
    if (!userId || !behaviorCategory || !action) {
      console.warn('Invalid parameters for behavior tracking');
      return;
    }

    const behaviorKey = `${userId}_${behaviorCategory}`;
    const timestamp = Date.now();
    
    // Store behavior data
    const behaviorData = {
      category: behaviorCategory,
      action: action,
      context: context,
      timestamp: timestamp,
      lessonId: this.getCurrentLessonId(),
      sessionId: this.getSessionId()
    };

    // Add to behavior history
    if (!this.behaviorHistory.has(behaviorKey)) {
      this.behaviorHistory.set(behaviorKey, []);
    }
    this.behaviorHistory.get(behaviorKey).push(behaviorData);

    // Update trait scores based on behavior
    this.updateTraitScores(userId, behaviorCategory, action);
    
    // Save to Firebase
    this.saveBehaviorToFirebase(userId, behaviorData);
  }

  // Update trait scores based on behavior
  updateTraitScores(userId, behaviorCategory, action) {
    const indicators = BEHAVIOR_INDICATORS[behaviorCategory];
    if (!indicators) return;

    const actionLower = action.toLowerCase();
    let scoreChange = 0;

    // Check positive indicators
    for (const indicator of indicators.positive) {
      if (actionLower.includes(indicator.toLowerCase())) {
        scoreChange += 1;
      }
    }

    // Check negative indicators
    for (const indicator of indicators.negative) {
      if (actionLower.includes(indicator.toLowerCase())) {
        scoreChange -= 1;
      }
    }

    // Map behavior category to trait
    const traitMapping = {
      [BEHAVIOR_CATEGORIES.RISK_TAKING]: 'risk_taker',
      [BEHAVIOR_CATEGORIES.CAUTION]: 'cautious',
      [BEHAVIOR_CATEGORIES.SCIENTIFIC_THINKING]: 'science_minded',
      [BEHAVIOR_CATEGORIES.COLLABORATION]: 'collaborative',
      [BEHAVIOR_CATEGORIES.CURIOSITY]: 'curious',
      [BEHAVIOR_CATEGORIES.ANALYTICAL]: 'analytical',
      [BEHAVIOR_CATEGORIES.LEADERSHIP]: 'leader',
      [BEHAVIOR_CATEGORIES.CREATIVITY]: 'creative',
      [BEHAVIOR_CATEGORIES.PERSISTENCE]: 'persistent',
      [BEHAVIOR_CATEGORIES.ADAPTABILITY]: 'adaptable'
    };

    const trait = traitMapping[behaviorCategory];
    if (trait && scoreChange !== 0) {
      this.updateTraitScore(userId, trait, scoreChange);
    }
  }

  // Update individual trait score
  async updateTraitScore(userId, trait, scoreChange) {
    try {
      const profileRef = doc(db, 'user_profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      let currentTraits = {};
      if (profileDoc.exists()) {
        currentTraits = profileDoc.data().traits || {};
      }

      // Update trait score (clamp between 0 and 10)
      const currentScore = currentTraits[trait] || 0;
      const newScore = Math.max(0, Math.min(10, currentScore + scoreChange));
      
      currentTraits[trait] = newScore;

      // Save updated traits
      await setDoc(profileRef, { 
        traits: currentTraits,
        lastUpdated: Date.now()
      }, { merge: true });

      console.log(`Updated trait ${trait} for user ${userId}: ${currentScore} → ${newScore}`);
      
      // Generate feedback if significant change
      if (Math.abs(scoreChange) >= 2) {
        this.generateTraitFeedback(userId, trait, newScore, scoreChange);
      }

    } catch (error) {
      console.error('Error updating trait score:', error);
    }
  }

  // Generate personalized trait feedback
  async generateTraitFeedback(userId, trait, score, change) {
    try {
      const traitDef = TRAIT_DEFINITIONS[trait];
      if (!traitDef) return;

      const feedbackMessages = traitDef.feedback;
      const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      
      // Save feedback to user profile
      const profileRef = doc(db, 'user_profiles', userId);
      await updateDoc(profileRef, {
        traitFeedback: randomFeedback,
        feedbackTimestamp: Date.now()
      });

    } catch (error) {
      console.error('Error generating trait feedback:', error);
    }
  }

  // Get user's current traits
  async getUserTraits(userId) {
    try {
      const profileRef = doc(db, 'user_profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        return profileDoc.data().traits || {};
      }
      
      return {};
    } catch (error) {
      console.error('Error getting user traits:', error);
      return {};
    }
  }

  // Get user's trait feedback
  async getUserTraitFeedback(userId) {
    try {
      const profileRef = doc(db, 'user_profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      if (profileDoc.exists()) {
        return profileDoc.data().traitFeedback || 'Your profile is still evolving.';
      }
      
      return 'Your profile is still evolving.';
    } catch (error) {
      console.error('Error getting trait feedback:', error);
      return 'Your profile is still evolving.';
    }
  }

  // Get behavior history for a user
  async getBehaviorHistory(userId, limit = 50) {
    try {
      const behaviorsRef = collection(db, 'user_behaviors');
      const q = query(behaviorsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const behaviors = [];
      querySnapshot.forEach((doc) => {
        behaviors.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by timestamp descending and limit
      return behaviors
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting behavior history:', error);
      return [];
    }
  }

  // Save behavior to Firebase
  async saveBehaviorToFirebase(userId, behaviorData) {
    try {
      const behaviorsRef = collection(db, 'user_behaviors');
      await setDoc(doc(behaviorsRef), {
        userId: userId,
        ...behaviorData
      });
    } catch (error) {
      console.error('Error saving behavior to Firebase:', error);
    }
  }

  // Get dominant traits (top 3)
  async getDominantTraits(userId) {
    const traits = await this.getUserTraits(userId);
    const sortedTraits = Object.entries(traits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trait, score]) => ({ trait, score }));
    
    return sortedTraits;
  }

  // Generate comprehensive profile summary
  async generateProfileSummary(userId) {
    const traits = await this.getUserTraits(userId);
    const dominantTraits = await this.getDominantTraits(userId);
    const feedback = await this.getUserTraitFeedback(userId);
    
    return {
      traits,
      dominantTraits,
      feedback,
      totalBehaviors: Object.keys(traits).length,
      lastUpdated: Date.now()
    };
  }

  // Track mission completion and update profile
  async onMissionCompleted(userId, lessonId, completionData = {}) {
    try {
      // Track completion behavior
      this.trackBehavior(userId, BEHAVIOR_CATEGORIES.PERSISTENCE, 'completed mission', lessonId);
      
      // Update profile with completion data
      const profileRef = doc(db, 'user_profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      let profile = { missions: [] };
      if (profileDoc.exists()) {
        profile = profileDoc.data();
      }
      
      // Add mission completion
      const missionCompletion = {
        lessonId,
        completedAt: Date.now(),
        ...completionData
      };
      
      profile.missions.push(missionCompletion);
      profile.lastMissionCompleted = Date.now();
      
      await setDoc(profileRef, profile, { merge: true });
      
      // Generate new trait feedback based on completion
      await this.generateCompletionFeedback(userId, lessonId, completionData);
      
    } catch (error) {
      console.error('Error handling mission completion:', error);
    }
  }

  // Generate feedback based on mission completion
  async generateCompletionFeedback(userId, lessonId, completionData) {
    try {
      const traits = await this.getUserTraits(userId);
      const dominantTraits = await this.getDominantTraits(userId);
      
      if (dominantTraits.length > 0) {
        const topTrait = dominantTraits[0];
        const traitDef = TRAIT_DEFINITIONS[topTrait.trait];
        
        if (traitDef) {
          const completionFeedback = `Mission completed! Your ${traitDef.label.toLowerCase()} approach served you well in this challenge.`;
          
          const profileRef = doc(db, 'user_profiles', userId);
          await updateDoc(profileRef, {
            traitFeedback: completionFeedback,
            feedbackTimestamp: Date.now()
          });
        }
      }
    } catch (error) {
      console.error('Error generating completion feedback:', error);
    }
  }

  // Helper methods
  getCurrentLessonId() {
    // This would be set by the lesson component
    return sessionStorage.getItem('currentLessonId') || 'unknown';
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || Date.now().toString();
  }

  // Set current lesson ID for tracking
  setCurrentLessonId(lessonId) {
    sessionStorage.setItem('currentLessonId', lessonId);
  }

  // Clear session data
  clearSessionData() {
    sessionStorage.removeItem('currentLessonId');
    sessionStorage.removeItem('sessionId');
  }

  // Initialize sample traits for testing (remove this in production)
  async initializeSampleTraits(userId) {
    try {
      const sampleTraits = {
        risk_taker: 3,
        cautious: 2,
        science_minded: 4,
        collaborative: 3,
        curious: 5,
        analytical: 4,
        leader: 2,
        creative: 3,
        persistent: 4,
        adaptable: 3
      };

      const profileRef = doc(db, 'user_profiles', userId);
      await setDoc(profileRef, {
        traits: sampleTraits,
        traitFeedback: "Your curiosity and analytical thinking are driving your learning journey!",
        lastUpdated: Date.now()
      }, { merge: true });

      console.log('Sample traits initialized for user:', userId);
      return sampleTraits;
    } catch (error) {
      console.error('Error initializing sample traits:', error);
      return {};
    }
  }
}

// Create global instance
const smartProfileSystem = new SmartProfileSystem();

export default smartProfileSystem;
export { BEHAVIOR_CATEGORIES, BEHAVIOR_INDICATORS, TRAIT_DEFINITIONS }; 