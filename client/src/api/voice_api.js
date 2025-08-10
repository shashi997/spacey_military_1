import { encode } from '@msgpack/msgpack';
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID;
const USE_ELEVEN_LABS_TTS = (import.meta.env.VITE_USE_ELEVEN_LABS_TTS ?? 'true').toString().toLowerCase();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

// In-memory audio cache
const audioCache = new Map();
const cacheKey = (text) => encode(text).toString();

export const synthesizeSpeech = async (text, options = {}) => {
  const key = cacheKey(text);

  if (!text || !text.trim()) {
    throw new Error('synthesizeSpeech: text is empty');
  }

  // If ElevenLabs is toggled off, prevent accidental use
  if (!isElevenLabsEnabled()) {
    throw new Error('ElevenLabs TTS is disabled via VITE_USE_ELEVEN_LABS_TTS=false');
  }

  // Ensure configuration is present
  if (!ELEVEN_LABS_API_KEY || !VOICE_ID) {
    throw new Error('Missing ElevenLabs configuration. Please set VITE_ELEVEN_LABS_API_KEY and VITE_ELEVEN_LABS_VOICE_ID in your client environment.');
  }

  // Check memory cache first
  if (audioCache.has(key)) {
    const { blob, timestamp } = audioCache.get(key);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return URL.createObjectURL(blob);
    }
    audioCache.delete(key);
  }

  try {
    const body = {
      text,
      model_id: options.model_id || 'eleven_monolingual_v1',
      voice_settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarity_boost ?? 0.75,
        style: options.style,
        use_speaker_boost: options.use_speaker_boost ?? true,
      },
      output_format: options.output_format || 'mp3_44100_128',
    };

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify(body),
      mode: 'cors',
    });

    if (!response.ok) {
      // Try to parse JSON error if available, otherwise fall back to status text
      let message = response.statusText || 'Speech synthesis failed';
      try {
        const errorJson = await response.json();
        message = errorJson?.detail?.message || errorJson?.message || message;
      } catch {
        // ignore
      }
      throw new Error(message);
    }

    // Ensure blob has the right MIME type for reliable playback
    const arrayBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

    // Cache the result
    audioCache.set(key, {
      blob: audioBlob,
      timestamp: Date.now(),
    });

    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    throw error;
  }
};

export const cleanup = (url) => {
  if (url) URL.revokeObjectURL(url);
};

// -----------------------------------------------------------------------------
// Toggle helpers and Web Speech fallback
// -----------------------------------------------------------------------------

export const isElevenLabsEnabled = () => {
  return USE_ELEVEN_LABS_TTS === 'true' || USE_ELEVEN_LABS_TTS === '1' || USE_ELEVEN_LABS_TTS === 'yes' || USE_ELEVEN_LABS_TTS === 'on';
};

export const cancelWebSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const speakWithWebSpeech = (text, { onStart, onEnd, voiceName, rate = 1, pitch = 1, volume = 1 } = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    const error = new Error('Web Speech API not supported in this environment');
    console.error(error);
    if (onEnd) onEnd();
    return () => {};
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  const chooseVoice = () => {
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return null;
    if (voiceName) {
      return voices.find(v => v.name === voiceName) || null;
    }
    return (
      voices.find(v => /(samantha|zira|karen|victoria|shelley|sandy|female|tessa|sara)/i.test(v.name)) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
      voices[0]
    );
  };

  const assignVoice = () => {
    const v = chooseVoice();
    if (v) utterance.voice = v;
  };
  assignVoice();
  if (utterance.voice == null) {
    synth.addEventListener('voiceschanged', assignVoice, { once: true });
  }

  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  utterance.onstart = () => {
    if (onStart) onStart();
  };
  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = (event) => {
    console.error('Web Speech synthesis error', event);
    if (onEnd) onEnd();
  };

  // Speak
  try {
    synth.speak(utterance);
  } catch (e) {
    console.error('Web Speech speak() failed', e);
    if (onEnd) onEnd();
  }

  // Return a cancel function
  return () => {
    try { synth.cancel(); } catch {}
  };
};