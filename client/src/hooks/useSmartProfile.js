import { useEffect, useCallback } from 'react';
import smartProfileSystem, { BEHAVIOR_CATEGORIES } from '../utils/smartProfileSystem';

/**
 * Hook for integrating Smart Profile System with lesson components
 * @param {string} userId - The current user's ID
 * @param {string} lessonId - The current lesson ID
 * @returns {Object} Functions for tracking behavior and mission completion
 */
export const useSmartProfile = (userId, lessonId) => {
  
  // Set current lesson ID for tracking
  useEffect(() => {
    if (lessonId) {
      smartProfileSystem.setCurrentLessonId(lessonId);
    }
  }, [lessonId]);

  // Track user behavior during lesson
  const trackBehavior = useCallback((behaviorCategory, action, context = '') => {
    if (!userId) {
      console.warn('Cannot track behavior: No user ID');
      return;
    }
    
    smartProfileSystem.trackBehavior(userId, behaviorCategory, action, context);
  }, [userId]);

  // Track specific behavior types with convenience methods
  const trackRiskTaking = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.RISK_TAKING, action, context);
  }, [trackBehavior]);

  const trackCaution = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.CAUTION, action, context);
  }, [trackBehavior]);

  const trackScientificThinking = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.SCIENTIFIC_THINKING, action, context);
  }, [trackBehavior]);

  const trackCollaboration = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.COLLABORATION, action, context);
  }, [trackBehavior]);

  const trackCuriosity = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.CURIOSITY, action, context);
  }, [trackBehavior]);

  const trackAnalytical = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.ANALYTICAL, action, context);
  }, [trackBehavior]);

  const trackLeadership = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.LEADERSHIP, action, context);
  }, [trackBehavior]);

  const trackCreativity = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.CREATIVITY, action, context);
  }, [trackBehavior]);

  const trackPersistence = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.PERSISTENCE, action, context);
  }, [trackBehavior]);

  const trackAdaptability = useCallback((action, context = '') => {
    trackBehavior(BEHAVIOR_CATEGORIES.ADAPTABILITY, action, context);
  }, [trackBehavior]);

  // Track mission completion
  const completeMission = useCallback((completionData = {}) => {
    if (!userId || !lessonId) {
      console.warn('Cannot complete mission: Missing user ID or lesson ID');
      return;
    }
    
    smartProfileSystem.onMissionCompleted(userId, lessonId, completionData);
  }, [userId, lessonId]);

  // Track choice-based behavior
  const trackChoice = useCallback((choice, options, context = '') => {
    if (!userId) return;
    
    // Analyze choice for behavior patterns
    const choiceLower = choice.toLowerCase();
    
    // Check for risk-taking choices
    if (choiceLower.includes('risky') || choiceLower.includes('bold') || choiceLower.includes('experiment')) {
      trackRiskTaking(`chose ${choice}`, context);
    }
    
    // Check for cautious choices
    if (choiceLower.includes('safe') || choiceLower.includes('careful') || choiceLower.includes('plan')) {
      trackCaution(`chose ${choice}`, context);
    }
    
    // Check for scientific thinking
    if (choiceLower.includes('research') || choiceLower.includes('analyze') || choiceLower.includes('understand')) {
      trackScientificThinking(`chose ${choice}`, context);
    }
    
    // Check for collaboration
    if (choiceLower.includes('help') || choiceLower.includes('team') || choiceLower.includes('together')) {
      trackCollaboration(`chose ${choice}`, context);
    }
    
    // Check for curiosity
    if (choiceLower.includes('explore') || choiceLower.includes('learn') || choiceLower.includes('discover')) {
      trackCuriosity(`chose ${choice}`, context);
    }
    
    // Check for analytical thinking
    if (choiceLower.includes('compare') || choiceLower.includes('evaluate') || choiceLower.includes('calculate')) {
      trackAnalytical(`chose ${choice}`, context);
    }
    
    // Check for leadership
    if (choiceLower.includes('lead') || choiceLower.includes('initiative') || choiceLower.includes('decide')) {
      trackLeadership(`chose ${choice}`, context);
    }
    
    // Check for creativity
    if (choiceLower.includes('creative') || choiceLower.includes('innovative') || choiceLower.includes('unique')) {
      trackCreativity(`chose ${choice}`, context);
    }
    
    // Check for persistence
    if (choiceLower.includes('try again') || choiceLower.includes('keep going') || choiceLower.includes('persevere')) {
      trackPersistence(`chose ${choice}`, context);
    }
    
    // Check for adaptability
    if (choiceLower.includes('adapt') || choiceLower.includes('change') || choiceLower.includes('adjust')) {
      trackAdaptability(`chose ${choice}`, context);
    }
  }, [userId, trackRiskTaking, trackCaution, trackScientificThinking, trackCollaboration, 
      trackCuriosity, trackAnalytical, trackLeadership, trackCreativity, trackPersistence, trackAdaptability]);

  // Track question asking behavior
  const trackQuestion = useCallback((question, context = '') => {
    if (!userId) return;
    
    const questionLower = question.toLowerCase();
    
    // Track curiosity
    if (questionLower.includes('how') || questionLower.includes('why') || questionLower.includes('what')) {
      trackCuriosity(`asked: ${question}`, context);
    }
    
    // Track scientific thinking
    if (questionLower.includes('work') || questionLower.includes('mechanism') || questionLower.includes('physics')) {
      trackScientificThinking(`asked: ${question}`, context);
    }
    
    // Track analytical thinking
    if (questionLower.includes('compare') || questionLower.includes('difference') || questionLower.includes('better')) {
      trackAnalytical(`asked: ${question}`, context);
    }
  }, [userId, trackCuriosity, trackScientificThinking, trackAnalytical]);

  // Track problem-solving approach
  const trackProblemSolving = useCallback((approach, problem, context = '') => {
    if (!userId) return;
    
    const approachLower = approach.toLowerCase();
    
    // Analyze approach for behavior patterns
    if (approachLower.includes('experiment') || approachLower.includes('try')) {
      trackRiskTaking(`solved problem with: ${approach}`, context);
    }
    
    if (approachLower.includes('research') || approachLower.includes('study')) {
      trackScientificThinking(`solved problem with: ${approach}`, context);
    }
    
    if (approachLower.includes('ask for help') || approachLower.includes('team')) {
      trackCollaboration(`solved problem with: ${approach}`, context);
    }
    
    if (approachLower.includes('analyze') || approachLower.includes('compare')) {
      trackAnalytical(`solved problem with: ${approach}`, context);
    }
    
    if (approachLower.includes('creative') || approachLower.includes('innovative')) {
      trackCreativity(`solved problem with: ${approach}`, context);
    }
  }, [userId, trackRiskTaking, trackScientificThinking, trackCollaboration, trackAnalytical, trackCreativity]);

  return {
    // Core tracking functions
    trackBehavior,
    completeMission,
    
    // Specific behavior tracking
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
    
    // High-level tracking functions
    trackChoice,
    trackQuestion,
    trackProblemSolving,
    
    // Behavior categories for reference
    BEHAVIOR_CATEGORIES
  };
};

export default useSmartProfile; 