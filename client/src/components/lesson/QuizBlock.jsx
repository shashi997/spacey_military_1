import React, { useState } from 'react';
import { CheckCircle, XCircle, BrainCircuit, SkipForward } from 'lucide-react';
import useSmartProfile from '../../hooks/useSmartProfile';

const QuizBlock = ({ block, onComplete, userId, lessonId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizBehavior, setQuizBehavior] = useState({
    totalQuestions: block.questions.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    timeSpent: 0,
    attempts: 0
  });

  const { trackAnalytical, trackPersistence, trackCuriosity, trackScientificThinking } = useSmartProfile(userId, lessonId);

  const currentQuestion = block.questions[currentQuestionIndex];

  const handleOptionSelect = (option, index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    // Track quiz behavior
    if (userId && lessonId) {
      const isCorrect = option.is_correct;
      
      // Update quiz behavior state
      setQuizBehavior(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
        attempts: prev.attempts + 1
      }));
      
      // Track analytical thinking for quiz participation
      trackAnalytical(`answered quiz question: ${currentQuestion.question_text.substring(0, 50)}...`, 'quiz');
      
      // Track scientific thinking if the question is science-related
      if (currentQuestion.question_text.toLowerCase().includes('physics') || 
          currentQuestion.question_text.toLowerCase().includes('science') ||
          currentQuestion.question_text.toLowerCase().includes('mechanism')) {
        trackScientificThinking(`answered science question: ${currentQuestion.question_text.substring(0, 50)}...`, 'quiz');
      }
      
      // Track persistence if they got it wrong but will continue
      if (!isCorrect) {
        trackPersistence(`continued after incorrect answer`, 'quiz');
      }
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);

    if (currentQuestionIndex < block.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Track quiz completion behavior
      if (userId && lessonId) {
        const accuracy = quizBehavior.correctAnswers / quizBehavior.totalQuestions;
        
        if (accuracy >= 0.8) {
          trackAnalytical(`completed quiz with high accuracy: ${Math.round(accuracy * 100)}%`, 'quiz_completion');
        } else if (accuracy >= 0.6) {
          trackPersistence(`completed quiz with moderate accuracy: ${Math.round(accuracy * 100)}%`, 'quiz_completion');
        } else {
          trackPersistence(`completed quiz despite low accuracy: ${Math.round(accuracy * 100)}%`, 'quiz_completion');
        }
      }
      
      onComplete();
    }
  };

  const getButtonClass = (option, index) => {
    if (!isAnswered) {
      // Default state for an option button
      return "bg-gray-800/50 border-gray-700 hover:bg-purple-500/30 hover:border-purple-400 hover:scale-105";
    }
    if (option.is_correct) {
      // Style for the correct answer after selection
      return "bg-green-500/30 border-green-500 scale-105 shadow-lg shadow-green-500/20";
    }
    if (index === selectedOption && !option.is_correct) {
      // Style for the incorrect option the user selected
      return "bg-red-500/30 border-red-500";
    }
    // Style for other unselected, incorrect options
    return "bg-gray-800/50 border-gray-700 opacity-50";
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C...
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-black/20 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      {/* Quiz Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <BrainCircuit size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Knowledge Check!
        </h2>
        <p className="font-mono text-sm text-gray-400 mt-2">
          Question {currentQuestionIndex + 1} of {block.questions.length}
        </p>
      </div>

      {/* Question */}
      <p className="text-xl md:text-2xl text-center text-gray-200 my-8 font-medium">
        {currentQuestion.question_text}
      </p>
      
      {/* Options */}
      <div className="flex flex-col items-center justify-center gap-4 mt-8 w-full">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option, index)}
            disabled={isAnswered}
            className={`w-full text-left p-4 font-semibold text-white rounded-lg transition-all duration-300 flex items-center gap-4 border-2 ${getButtonClass(option, index)}`}
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-md font-bold text-cyan-300">
              {getOptionLabel(index)}
            </span>
            <span className="flex-grow">{option.text}</span>
            {isAnswered && option.is_correct && <CheckCircle className="text-green-400 flex-shrink-0" />}
            {isAnswered && index === selectedOption && !option.is_correct && <XCircle className="text-red-400 flex-shrink-0" />}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className="mt-8 p-4 rounded-lg bg-black/40 animate-fade-in text-center">
          <p className={`text-lg font-semibold ${currentQuestion.options[selectedOption].is_correct ? 'text-green-400' : 'text-red-400'}`}>
            {currentQuestion.options[selectedOption].is_correct ? currentQuestion.correct_feedback : currentQuestion.incorrect_feedback}
          </p>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="text-center mt-10">
            <button
            onClick={handleNext}
            className="inline-flex items-center gap-3 px-8 py-3 font-semibold text-white bg-cyan-600 rounded-full hover:bg-cyan-500 transition-all duration-300 hover:scale-105 shadow-lg"
            >
            <span>{currentQuestionIndex < block.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
            <SkipForward />
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizBlock;
