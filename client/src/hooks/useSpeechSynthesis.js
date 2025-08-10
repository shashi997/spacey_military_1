// Deprecated: This hook used the browser Web Speech API.
// We now enforce ElevenLabs-only TTS via useCoordinatedSpeechSynthesis.
const useSpeechSynthesis = () => {
  return {
    isSupported: false,
    isSpeaking: false,
    speak: () => {
      throw new Error('useSpeechSynthesis is deprecated. Use useCoordinatedSpeechSynthesis (ElevenLabs) instead.');
    },
    cancel: () => {},
    prime: () => {},
    voices: [],
    selectedVoice: null,
    setSelectedVoice: () => {},
  };
};

export default useSpeechSynthesis;
