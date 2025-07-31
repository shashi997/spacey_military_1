const express = require('express');
const router = express.Router();
const { traitAnalyzer } = require('../controllers/traitAnalyzer');

// Get user's trait feedback
router.get('/traitFeedback/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get user's profile from Firebase (this would be implemented with Firebase Admin SDK)
    // For now, we'll return a default feedback
    const feedback = "Your profile is still evolving. Complete more missions to see your traits develop!";
    
    res.json({ feedback });
  } catch (error) {
    console.error('Error getting trait feedback:', error);
    res.status(500).json({ error: 'Failed to get trait feedback' });
  }
});

// Get user's complete profile data
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // This would fetch from Firebase in a real implementation
    const profileData = {
      traits: {},
      dominantTraits: [],
      feedback: "Your profile is still evolving.",
      missions: [],
      lastUpdated: Date.now()
    };
    
    res.json(profileData);
  } catch (error) {
    console.error('Error getting profile data:', error);
    res.status(500).json({ error: 'Failed to get profile data' });
  }
});

// Track behavior (for future use)
router.post('/trackBehavior', async (req, res) => {
  try {
    const { userId, behaviorCategory, action, context } = req.body;
    
    if (!userId || !behaviorCategory || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // This would save to Firebase in a real implementation
    console.log('Tracking behavior:', { userId, behaviorCategory, action, context });
    
    res.json({ success: true, message: 'Behavior tracked successfully' });
  } catch (error) {
    console.error('Error tracking behavior:', error);
    res.status(500).json({ error: 'Failed to track behavior' });
  }
});

// Complete mission
router.post('/completeMission', async (req, res) => {
  try {
    const { userId, lessonId, completionData } = req.body;
    
    if (!userId || !lessonId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // This would update Firebase in a real implementation
    console.log('Mission completed:', { userId, lessonId, completionData });
    
    res.json({ success: true, message: 'Mission completion tracked successfully' });
  } catch (error) {
    console.error('Error completing mission:', error);
    res.status(500).json({ error: 'Failed to track mission completion' });
  }
});

module.exports = router; 