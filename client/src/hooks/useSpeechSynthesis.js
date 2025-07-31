import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechSynthesis = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    setIsSupported(true);
    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const allVoices = synth.getVoices();

      // Try filtering likely female voices by name
      const femaleVoices = allVoices.filter((voice) =>
        /(samantha|zira|karen|victoria|shelley|sandy|female|tessa|sara)/i.test(voice.name)
      );

      setVoices(femaleVoices);

      if (!selectedVoice && femaleVoices.length > 0) {
        setSelectedVoice(femaleVoices[0]); // pick the first female voice
      } else if (!selectedVoice && allVoices.length > 0) {
        setSelectedVoice(allVoices.find(v => v.lang.startsWith('en')) || allVoices[0]);
      }
    };

    synth.addEventListener('voiceschanged', updateVoices);
    updateVoices();

    return () => {
      synth.removeEventListener('voiceschanged', updateVoices);
      synth.cancel();
    };
  }, [selectedVoice]);

  const speak = useCallback(
    (text, { onEnd } = {}) => {
      const textToSpeak = text.trim();
      if (!isSupported || !textToSpeak) {
        if (onEnd) setTimeout(() => onEnd(), 0);
        return;
      }

      const synth = window.speechSynthesis;

      const trySpeak = () => {
        const allVoices = synth.getVoices();
        if (allVoices.length === 0) {
          setTimeout(trySpeak, 100);
          return;
        }

        if (synth.speaking) {
          synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Fallback to first matching female voice or any English voice
        const fallbackVoice =
          selectedVoice ||
          allVoices.find((v) =>
            /(samantha|zira|karen|victoria|shelley|sandy|female|tessa|sara)/i.test(v.name)
          ) ||
          allVoices.find((v) => v.lang.startsWith('en')) ||
          allVoices[0];

        utterance.voice = fallbackVoice;

        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          isSpeakingRef.current = true;
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setTimeout(() => {
            isSpeakingRef.current = false;
            setIsSpeaking(false);
            if (onEnd) onEnd();
          }, 100);
        };

        utterance.onerror = (event) => {
          console.error('SpeechSynthesis Error', event);
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          if (onEnd) onEnd();
        };

        console.log('Using voice:', utterance.voice.name);
        synth.speak(utterance);
      };

      trySpeak();
    },
    [isSupported, selectedVoice]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, [isSupported]);

  const prime = useCallback(() => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) return;
    const utterance = new SpeechSynthesisUtterance(' ');
    utterance.volume = 0;
    synth.speak(utterance);
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    speak,
    cancel,
    prime,
    voices,
    selectedVoice,
    setSelectedVoice
  };
};

export default useSpeechSynthesis;
