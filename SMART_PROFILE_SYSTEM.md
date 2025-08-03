# Smart Profile System

A comprehensive feedback system that tracks player behavior and provides evolving traits based on their actions during missions.

## Overview

The Smart Profile System monitors player behavior throughout their learning journey and dynamically updates their profile with personalized traits and feedback. When players complete missions, their profile is updated with new insights about their learning style and personality.

## Features

### 🎯 Behavior Tracking
- **10 Behavior Categories**: Risk-taking, caution, scientific thinking, collaboration, curiosity, analytical thinking, leadership, creativity, persistence, and adaptability
- **Real-time Analysis**: Tracks player choices, questions, and problem-solving approaches
- **Context-Aware**: Considers lesson context and mission type when analyzing behavior

### 🧠 Evolving Traits
- **Dynamic Scoring**: Traits evolve based on consistent behavior patterns
- **Personalized Feedback**: Provides context-aware feedback messages
- **Visual Progress**: Shows trait development with progress bars and scores

### 🚀 Mission Integration
- **Automatic Tracking**: Integrates seamlessly with lesson components
- **Completion Rewards**: Updates profile when missions are completed
- **Behavior History**: Maintains detailed logs of player actions

## Architecture

### Core Components

#### 1. Smart Profile System (`client/src/utils/smartProfileSystem.js`)
```javascript
// Main system class
class SmartProfileSystem {
  trackBehavior(userId, behaviorCategory, action, context)
  updateTraitScore(userId, trait, scoreChange)
  generateTraitFeedback(userId, trait, score, change)
  onMissionCompleted(userId, lessonId, completionData)
}
```

#### 2. Behavior Categories
```javascript
export const BEHAVIOR_CATEGORIES = {
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
```

#### 3. Trait Definitions
```javascript
export const TRAIT_DEFINITIONS = {
  risk_taker: {
    label: 'Risk Taker',
    description: 'You tend to take calculated risks and embrace bold approaches',
    color: 'bg-yellow-400',
    feedback: ['You\'re not afraid to push boundaries...', ...]
  },
  // ... other traits
};
```

### Integration Hooks

#### useSmartProfile Hook (`client/src/hooks/useSmartProfile.js`)
```javascript
const { 
  trackBehavior,
  trackChoice,
  trackQuestion,
  trackProblemSolving,
  completeMission
} = useSmartProfile(userId, lessonId);
```

### Component Integration

#### ChoiceBlock Component
```javascript
const handleChoice = (choice) => {
  // Track the choice for behavior analysis
  if (userId && lessonId) {
    trackChoice(choice.text, block.choices.map(c => c.text), block.content);
  }
  onChoice(choice);
};
```

#### QuizBlock Component
```javascript
const handleOptionSelect = (option, index) => {
  // Track quiz behavior
  trackAnalytical(`answered quiz question: ${questionText}`, 'quiz');
  
  if (isCorrect) {
    trackScientificThinking(`answered science question: ${questionText}`, 'quiz');
  }
};
```

## Usage Examples

### 1. Tracking User Choices
```javascript
// In a lesson component
const { trackChoice } = useSmartProfile(userId, lessonId);

const handleUserChoice = (choice) => {
  trackChoice(choice.text, availableOptions, context);
  // Continue with lesson flow
};
```

### 2. Tracking Questions
```javascript
const { trackQuestion } = useSmartProfile(userId, lessonId);

const handleUserQuestion = (question) => {
  trackQuestion(question, 'lesson_context');
  // Provide answer
};
```

### 3. Mission Completion
```javascript
const { completeMission } = useSmartProfile(userId, lessonId);

const handleMissionComplete = async () => {
  const completionData = {
    userTags: ['tag1', 'tag2'],
    chatHistory: chatHistory.length,
    lessonTitle: 'Space Warfare Briefing'
  };
  
  await completeMission(completionData);
};
```

## Database Schema

### User Profiles Collection
```javascript
{
  userId: "string",
  traits: {
    risk_taker: 5,
    cautious: 3,
    science_minded: 7,
    // ... other traits
  },
  traitFeedback: "Your scientific approach leads to well-founded conclusions.",
  feedbackTimestamp: 1234567890,
  missions: [
    {
      lessonId: "space_warfare_briefing",
      completedAt: 1234567890,
      userTags: ["analytical", "curious"],
      chatHistory: 15
    }
  ],
  lastMissionCompleted: 1234567890,
  lastUpdated: 1234567890
}
```

### User Behaviors Collection
```javascript
{
  userId: "string",
  category: "risk_taking",
  action: "chose risky option",
  context: "satellite_design",
  timestamp: 1234567890,
  lessonId: "build-satellite",
  sessionId: "session_123"
}
```

## API Endpoints

### Server Routes (`server/routes/profileRoutes.js`)

#### GET `/api/profile/traitFeedback/:userId`
Returns personalized trait feedback for a user.

#### GET `/api/profile/profile/:userId`
Returns complete profile data including traits and mission history.

#### POST `/api/profile/trackBehavior`
Tracks a specific behavior (for future server-side tracking).

#### POST `/api/profile/completeMission`
Records mission completion with associated data.

## Demo Component

The `SmartProfileDemo` component provides a comprehensive testing interface:

- **Current Profile Display**: Shows evolving traits and feedback
- **Behavior Tracking**: Test different behavior categories
- **Custom Actions**: Track custom behaviors
- **Mission Completion**: Simulate mission completion
- **Behavior History**: View recent tracked behaviors

## Implementation Details

### Behavior Analysis Logic

1. **Keyword Matching**: Analyzes action text against predefined indicators
2. **Context Consideration**: Weights behavior based on lesson context
3. **Pattern Recognition**: Identifies consistent behavior patterns
4. **Trait Mapping**: Maps behaviors to specific personality traits

### Trait Scoring System

- **Score Range**: 0-10 for each trait
- **Increment/Decrement**: Based on behavior frequency and intensity
- **Feedback Generation**: Triggered by significant score changes (≥2 points)
- **Dominant Traits**: Top 3 traits displayed prominently

### Integration Points

1. **Lesson Components**: ChoiceBlock, QuizBlock, ReflectionBlock
2. **Mission Completion**: LessonPage completion handler
3. **Profile Display**: PlayerProfile component
4. **Dashboard**: Real-time profile updates

## Future Enhancements

### Planned Features

1. **Advanced Analytics**: Machine learning for behavior pattern recognition
2. **Social Features**: Compare traits with other learners
3. **Achievement System**: Unlock achievements based on trait development
4. **Personalized Content**: Adapt lesson content based on dominant traits
5. **Progress Visualization**: Detailed charts and graphs of trait evolution

### Technical Improvements

1. **Real-time Updates**: WebSocket integration for live profile updates
2. **Offline Support**: Local caching of behavior data
3. **Performance Optimization**: Efficient data storage and retrieval
4. **A/B Testing**: Test different feedback algorithms

## Testing

### Manual Testing
1. Use the `SmartProfileDemo` component to test behavior tracking
2. Complete lessons and verify profile updates
3. Check Firebase for data persistence
4. Verify trait feedback generation

### Automated Testing
```javascript
// Example test structure
describe('Smart Profile System', () => {
  test('tracks behavior correctly', () => {
    // Test behavior tracking
  });
  
  test('updates traits based on behavior', () => {
    // Test trait evolution
  });
  
  test('generates appropriate feedback', () => {
    // Test feedback generation
  });
});
```

## Troubleshooting

### Common Issues

1. **Profile Not Updating**: Check Firebase connection and user authentication
2. **Behavior Not Tracked**: Verify userId and lessonId are provided
3. **Feedback Not Generated**: Check trait score thresholds and definitions
4. **Performance Issues**: Monitor Firebase query performance and optimize

### Debug Tools

- Browser console logging for behavior tracking
- Firebase console for data verification
- Demo component for testing functionality
- Network tab for API call monitoring

## Contributing

When contributing to the Smart Profile System:

1. **Add New Behaviors**: Update `BEHAVIOR_INDICATORS` with new patterns
2. **Create New Traits**: Add to `TRAIT_DEFINITIONS` with feedback messages
3. **Integrate Components**: Use the `useSmartProfile` hook in new components
4. **Test Thoroughly**: Use the demo component to verify functionality
5. **Update Documentation**: Keep this README current with changes

## License

This Smart Profile System is part of the Spacey Science learning platform and follows the same licensing terms. 