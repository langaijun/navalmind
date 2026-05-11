import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVoiceInputOptions {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  lang?: string;
}

export function useVoiceInput({ onResult, onError, lang = 'zh-CN' }: UseVoiceInputOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        onResult?.(finalTranscript);
      }

      if (interimTranscript) {
        setTranscript((prev) => {
          const base = prev.replace(/\[\.\.\.\]$/, '');
          return base + interimTranscript + '[...]';
        });
      }

      // Reset silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(() => {
        stopRecording();
      }, 2000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        onError?.('请允许麦克风权限以使用语音输入');
      } else if (event.error === 'no-speech') {
        onError?.('未能识别到语音，请重试');
      } else {
        onError?.('语音识别失败，请重试');
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, [lang]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setIsRecording(true);
    try {
      recognitionRef.current.start();
    } catch {
      onError?.('无法启动语音识别');
      setIsRecording(false);
    }
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    setIsRecording(false);
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
