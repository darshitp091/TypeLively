// src/components/TypingTest.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeSound } from "./ThemeSoundProvider";
import Keyboard from "./Keyboard";
import confetti from "canvas-confetti";
import Mascot from "./Mascot";

interface TypingTestProps {
  isDailyChallenge?: boolean;
  dailyChallengeData?: any;
  onChallengeComplete?: (stats: any) => void;
  overrideContentType?: 'general' | 'practice' | 'quote' | 'story' | 'coding' | 'multilingual';
  overrideCodingLanguage?: 'html' | 'css' | 'javascript' | 'python' | 'java' | 'c' | 'cplusplus' | 'sql';
  hideCategorySelector?: boolean;
  hideLanguageSelector?: boolean;
  overrideTestMode?: 'time' | 'page';
  overrideDuration?: number;
  overridePageCount?: number;
  overrideDifficulty?: 'easy' | 'medium' | 'hard';
  overrideLanguage?: 'english' | 'hindi' | 'gujarati';
}

export default function TypingTest({
  isDailyChallenge = false,
  dailyChallengeData,
  onChallengeComplete,
  overrideContentType,
  overrideCodingLanguage,
  hideCategorySelector = false,
  hideLanguageSelector = false,
  overrideTestMode,
  overrideDuration,
  overridePageCount,
  overrideDifficulty,
  overrideLanguage,
}: TypingTestProps) {
  const { playKeyPressSound } = useThemeSound();

  // Settings
  const [testMode, setTestMode] = useState<'time' | 'page'>(overrideTestMode || 'time');
  const [duration, setDuration] = useState<number>(overrideDuration || 60); // 60, 180, 300, 600
  const [pageCount, setPageCount] = useState<number>(overridePageCount || 1); // 1, 2, 5
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(overrideDifficulty || 'medium');
  const [contentType, setContentType] = useState<'general' | 'practice' | 'quote' | 'story' | 'coding' | 'multilingual'>(overrideContentType || 'general');
  const [language, setLanguage] = useState<'english' | 'hindi' | 'gujarati'>(overrideLanguage || 'english');
  const [codingLanguage, setCodingLanguage] = useState<'html' | 'css' | 'javascript' | 'python' | 'java' | 'c' | 'cplusplus' | 'sql'>(overrideCodingLanguage || 'javascript');

  // Pending settings for confirmation modal
  const [pendingSettings, setPendingSettings] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Core typing state
  const [text, setText] = useState<string>("Loading typing passage...");
  const [loading, setLoading] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Time & Stats tracking
  const [timeLeft, setTimeLeft] = useState<number>(overrideDuration || 60);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [totalKeysPressed, setTotalKeysPressed] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  // UI preferences
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

  const getMascotState = (): "idle" | "typing" | "celebrating" | "oops" | "sleepy" => {
    if (loading) return "sleepy";
    if (isFinished) {
      const correctCount = calculateCorrectChars(typedText);
      const accuracyVal = typedText.length > 0 ? (correctCount / typedText.length) * 100 : 0;
      if (accuracyVal >= 90 && mistakesCount < 8) {
        return "celebrating";
      } else {
        return "oops";
      }
    }
    if (isStarted && !isPaused) return "typing";
    return "idle";
  };

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const statsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Sync refs to prevent stale closure reads in timer interval callbacks
  const typedTextRef = useRef<string>("");
  const totalKeysPressedRef = useRef<number>(0);
  const mistakesCountRef = useRef<number>(0);
  const wpmHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    typedTextRef.current = typedText;
  }, [typedText]);

  useEffect(() => {
    totalKeysPressedRef.current = totalKeysPressed;
  }, [totalKeysPressed]);

  useEffect(() => {
    mistakesCountRef.current = mistakesCount;
  }, [mistakesCount]);

  useEffect(() => {
    wpmHistoryRef.current = wpmHistory;
  }, [wpmHistory]);

  // Load paragraph
  const fetchParagraph = async (currentSettings?: any) => {
    setLoading(true);
    setText("Generating fresh typing passage...");
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setIsPaused(false);
    setWpmHistory([]);
    setMistakesCount(0);
    setTotalKeysPressed(0);
    setElapsedTime(0);

    // Reset sync refs
    typedTextRef.current = "";
    totalKeysPressedRef.current = 0;
    mistakesCountRef.current = 0;
    wpmHistoryRef.current = [];

    const s = currentSettings || {
      testMode,
      duration,
      pageCount,
      difficulty,
      contentType,
      language,
      codingLanguage,
    };

    if (s.testMode === 'time') {
      setTimeLeft(s.duration);
    } else {
      setTimeLeft(0);
    }

    try {
      const response = await fetch("/api/generate-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await response.json();
      if (data.text) {
        setText(data.text);
      } else {
        setText("Failed to generate paragraph. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setText("Network error generating passage. Using offline fallback.");
    } finally {
      setLoading(false);
      setSessionId(Math.random().toString(36).substring(2, 11));
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  };

  // Daily challenge data setup
  useEffect(() => {
    if (isDailyChallenge && dailyChallengeData) {
      setText(dailyChallengeData.generated_text);
      setTestMode(dailyChallengeData.mode_type);
      if (dailyChallengeData.mode_type === 'time') {
        setDuration(dailyChallengeData.duration_value);
        setTimeLeft(dailyChallengeData.duration_value);
      } else {
        setPageCount(dailyChallengeData.page_count);
        setTimeLeft(0);
      }
      setDifficulty(dailyChallengeData.difficulty);
      setContentType(dailyChallengeData.content_type);
      setLanguage(dailyChallengeData.language);
      if (dailyChallengeData.coding_language) {
        setCodingLanguage(dailyChallengeData.coding_language);
      }
      setTypedText("");
      setIsStarted(false);
      setIsFinished(false);
      setIsPaused(false);
      setWpmHistory([]);
      setMistakesCount(0);
      setTotalKeysPressed(0);
      setElapsedTime(0);
      setSessionId(Math.random().toString(36).substring(2, 11));
    } else if (!isDailyChallenge) {
      fetchParagraph();
    }
  }, [isDailyChallenge, dailyChallengeData]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      stopTimers();
    };
  }, []);

  const stopTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (statsTimerRef.current) clearInterval(statsTimerRef.current);
  };

  const startTimers = () => {
    stopTimers();

    // Timer logic
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const nextTime = prev + 1;
        
        if (testMode === 'time') {
          setTimeLeft((time) => {
            if (time <= 1) {
              handleTestComplete(nextTime);
              return 0;
            }
            return time - 1;
          });
        }
        
        return nextTime;
      });
    }, 1000);

    // Stats history tracker (for consistency & chart rendering)
    statsTimerRef.current = setInterval(() => {
      setTypedText((currentTyped) => {
        setElapsedTime((time) => {
          if (time > 0) {
            const correctCount = calculateCorrectChars(currentTyped);
            const currentWpm = Math.round((correctCount / 5) / (time / 60));
            setWpmHistory((hist) => [...hist, currentWpm]);
          }
          return time;
        });
        return currentTyped;
      });
    }, 1000);
  };

  // Helper: calculate correct character count
  const calculateCorrectChars = (typed: string): number => {
    let count = 0;
    const len = Math.min(typed.length, text.length);
    for (let i = 0; i < len; i++) {
      if (typed[i] === text[i]) count++;
    }
    return count;
  };

  // Handle Keystroke Capture
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || isPaused) return;

    const value = e.target.value;
    
    // Prevent typing past the passage length
    if (value.length > text.length) return;

    // Start test on first keypress
    if (!isStarted) {
      setIsStarted(true);
      startTimers();
    }

    const previousLength = typedText.length;
    const currentLength = value.length;

    // Audio click trigger
    if (currentLength < previousLength) {
      playKeyPressSound("backspace");
    } else {
      const addedChar = value[value.length - 1];
      const targetChar = text[previousLength];

      setTotalKeysPressed((p) => p + 1);

      if (addedChar !== targetChar) {
        setMistakesCount((m) => m + 1);
        playKeyPressSound("mistake");
      } else if (addedChar === " ") {
        playKeyPressSound("space");
      } else {
        playKeyPressSound("normal");
      }
    }

    setTypedText(value);

    // Check completion condition (Page mode finishes when text is typed fully)
    if (value.length === text.length) {
      // Small timeout to let state update
      setTimeout(() => {
        handleTestComplete(elapsedTime + (currentLength - previousLength > 0 ? 0.5 : 0));
      }, 30);
    }
  };

  const handleTestComplete = (finalTimeSec: number) => {
    stopTimers();
    setIsFinished(true);
    
    // Read from latest refs to prevent stale closure values in interval callbacks
    const currentTypedText = typedTextRef.current;
    const currentKeysPressed = totalKeysPressedRef.current;
    const currentMistakes = mistakesCountRef.current;
    const currentWpmHistory = wpmHistoryRef.current;

    // Trigger confetti celebration for high accuracy!
    const correctCount = calculateCorrectChars(currentTypedText);
    const accuracyVal = currentKeysPressed > 0 
      ? Math.max(0, ((currentKeysPressed - currentMistakes) / currentKeysPressed) * 100) 
      : 100;
    
    if (accuracyVal > 90) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Final statistics object
    const finalSeconds = Math.max(1, finalTimeSec);
    const finalMinutes = finalSeconds / 60;
    
    const correctChars = calculateCorrectChars(currentTypedText);
    const finalWpm = Number(((correctChars / 5) / finalMinutes).toFixed(2));
    const finalRawWpm = Number(((currentKeysPressed / 5) / finalMinutes).toFixed(2));
    const finalCpm = Math.round(correctChars / finalMinutes);
    const finalAccuracy = Number(accuracyVal.toFixed(2));
    
    // Calculate typing speed consistency
    let finalConsistency = 85.0; // default baseline
    if (currentWpmHistory.length > 2) {
      const avgWpm = currentWpmHistory.reduce((a, b) => a + b, 0) / currentWpmHistory.length;
      if (avgWpm > 0) {
        const variance = currentWpmHistory.reduce((a, b) => a + Math.pow(b - avgWpm, 2), 0) / currentWpmHistory.length;
        const stdDev = Math.sqrt(variance);
        finalConsistency = Number(Math.max(10, Math.min(100, 100 - (stdDev / avgWpm) * 100)).toFixed(2));
      }
    }

    const stats = {
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      cpm: finalCpm,
      accuracy: finalAccuracy,
      mistakes: currentMistakes,
      consistency: finalConsistency,
      completionTime: Number(finalSeconds.toFixed(2)),
    };

    if (isDailyChallenge && onChallengeComplete) {
      onChallengeComplete(stats);
    }
  };

  // Pause / Resume test
  const togglePause = () => {
    if (isFinished || !isStarted) return;
    if (isPaused) {
      setIsPaused(false);
      startTimers();
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } else {
      setIsPaused(true);
      stopTimers();
    }
  };

  // Restart / Reset
  const handleRestart = () => {
    stopTimers();
    setTypedText("");
    setIsStarted(false);
    setIsFinished(false);
    setIsPaused(false);
    setWpmHistory([]);
    setMistakesCount(0);
    setTotalKeysPressed(0);
    setElapsedTime(0);

    // Reset sync refs
    typedTextRef.current = "";
    totalKeysPressedRef.current = 0;
    mistakesCountRef.current = 0;
    wpmHistoryRef.current = [];

    if (testMode === 'time') {
      setTimeLeft(duration);
    } else {
      setTimeLeft(0);
    }

    if (isDailyChallenge && dailyChallengeData) {
      setText(dailyChallengeData.generated_text);
    } else {
      fetchParagraph();
    }
  };

  // Intercept setting changes to handle Session Locking
  const handleSettingChange = (settingType: string, val: any) => {
    const changes = {
      testMode,
      duration,
      pageCount,
      difficulty,
      contentType,
      language,
      codingLanguage,
      [settingType]: val,
    };

    if (settingType === 'testMode' && val === 'time') {
      changes.timeLeft = duration;
    } else if (settingType === 'testMode' && val === 'page') {
      changes.timeLeft = 0;
    }

    // Check if test is active
    if (isStarted && !isFinished) {
      setPendingSettings(changes);
      setShowConfirmModal(true);
    } else {
      // Update states immediately
      applySettings(changes);
    }
  };

  const applySettings = (settings: any) => {
    if (settings.testMode !== undefined) setTestMode(settings.testMode);
    if (settings.duration !== undefined) setDuration(settings.duration);
    if (settings.pageCount !== undefined) setPageCount(settings.pageCount);
    if (settings.difficulty !== undefined) setDifficulty(settings.difficulty);
    if (settings.contentType !== undefined) {
      setContentType(settings.contentType);
      // Automatically lock language or coding language depending on selection
      if (settings.contentType === 'coding') {
        setLanguage('english');
      }
    }
    if (settings.language !== undefined) setLanguage(settings.language);
    if (settings.codingLanguage !== undefined) setCodingLanguage(settings.codingLanguage);

    setShowConfirmModal(false);
    setPendingSettings(null);

    // Re-generate text with new settings
    fetchParagraph(settings);
  };

  // Helper to get expected key
  const getExpectedKey = (): string | null => {
    if (isFinished || isPaused || loading) return null;
    if (typedText.length >= text.length) return null;
    return text[typedText.length];
  };

  // Render typing passage word-by-word to prevent line-breaking visual jumps
  const renderParagraph = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <span className="logo-icon" style={{ fontSize: '2rem', marginRight: '1rem' }}>⚡</span>
          <h3>Groq is writing your typing prompt...</h3>
        </div>
      );
    }

    if (contentType === 'coding') {
      const lines = text.split("\n");
      let charGlobalIdx = 0;
      return (
        <div 
          ref={textContainerRef}
          className="typing-text-wrapper"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.05rem',
            lineHeight: '1.5',
            whiteSpace: 'pre',
            display: 'block',
            width: '100%',
            maxHeight: focusMode ? '160px' : '260px',
            overflowY: 'auto',
            padding: '0.5rem',
            userSelect: 'none',
            textAlign: 'left',
          }}
        >
          {lines.map((lineText, lineIdx) => {
            const chars = lineText.split("");
            const isLastLine = lineIdx === lines.length - 1;
            
            return (
              <div 
                key={lineIdx} 
                className="code-line-row" 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'nowrap', 
                  minHeight: '1.5rem',
                }}
              >
                {chars.map((char, cIdx) => {
                  const globalIdx = charGlobalIdx++;
                  let charClass = "char-untyped";
                  let style: React.CSSProperties = {
                    color: "var(--char-untyped)",
                    position: "relative",
                  };

                  if (globalIdx < typedText.length) {
                    if (typedText[globalIdx] === text[globalIdx]) {
                      charClass = "char-correct";
                      style.color = "var(--char-correct)";
                    } else {
                      charClass = "char-mistake";
                      style.color = "var(--char-mistake)";
                      style.backgroundColor = "var(--char-mistake-bg)";
                      style.borderRadius = "2px";
                    }
                  } else if (globalIdx === typedText.length) {
                    charClass = "char-current";
                    style.backgroundColor = "var(--char-current-bg)";
                    style.color = "var(--text-main)";
                    style.borderRadius = "2px";
                  }

                  return (
                    <span 
                      key={cIdx} 
                      className={charClass} 
                      style={style}
                    >
                      {globalIdx === typedText.length && !isPaused && (
                        <span 
                          style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: "2px",
                            height: "100%",
                            background: "var(--char-cursor)",
                            animation: "blink 1s step-end infinite",
                          }} 
                        />
                      )}
                      {char}
                    </span>
                  );
                })}

                {!isLastLine && (() => {
                  const globalIdx = charGlobalIdx++;
                  let charClass = "char-untyped";
                  let style: React.CSSProperties = {
                    color: "rgba(108, 92, 231, 0.4)",
                    position: "relative",
                    marginLeft: '2px',
                    fontWeight: 700,
                  };

                  if (globalIdx < typedText.length) {
                    if (typedText[globalIdx] === text[globalIdx]) {
                      charClass = "char-correct";
                      style.color = "var(--char-correct)";
                    } else {
                      charClass = "char-mistake";
                      style.color = "var(--char-mistake)";
                      style.backgroundColor = "var(--char-mistake-bg)";
                      style.borderRadius = "2px";
                    }
                  } else if (globalIdx === typedText.length) {
                    charClass = "char-current";
                    style.backgroundColor = "var(--char-current-bg)";
                    style.color = "var(--text-main)";
                    style.borderRadius = "2px";
                  }

                  return (
                    <span key="newline" className={charClass} style={style}>
                      {globalIdx === typedText.length && !isPaused && (
                        <span 
                          style={{
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: "2px",
                            height: "100%",
                            background: "var(--char-cursor)",
                            animation: "blink 1s step-end infinite",
                          }} 
                        />
                      )}
                      ↵
                    </span>
                  );
                })()}
              </div>
            );
          })}
        </div>
      );
    }

    // Default (prose paragraphs) word-wrapped layout with Sliding Window for extreme performance
    const words = text.split(" ");
    
    // Find current word index
    const typedWords = typedText.split(" ");
    const currentWordIdx = typedWords.length - 1;
    
    // Show 12 words before and 38 words after the active word to prevent rendering lag on long paragraphs
    const windowStart = Math.max(0, currentWordIdx - 12);
    const windowEnd = Math.min(words.length, currentWordIdx + 38);
    
    // Compute character global index offset corresponding to windowStart
    let charGlobalIdx = 0;
    for (let i = 0; i < windowStart; i++) {
      charGlobalIdx += words[i].length + 1; // +1 for the space separator
    }

    const slicedWords = words.slice(windowStart, windowEnd);

    return (
      <div 
        ref={textContainerRef}
        className="typing-text-wrapper"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.35rem',
          lineHeight: '1.6',
          letterSpacing: '0.5px',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem 0.25rem',
          maxHeight: focusMode ? '160px' : '260px',
          overflowY: 'auto',
          padding: '0.5rem',
          userSelect: 'none',
        }}
      >
        {slicedWords.map((word, sliceIdx) => {
          const wIdx = windowStart + sliceIdx;
          const chars = word.split("");
          
          if (wIdx < words.length - 1) {
            chars.push(" ");
          }

          return (
            <span key={wIdx} className="word-block" style={{ display: 'inline-flex', flexWrap: 'nowrap' }}>
              {chars.map((char, cIdx) => {
                const globalIdx = charGlobalIdx++;
                let charClass = "char-untyped";
                let style: React.CSSProperties = {
                  color: "var(--char-untyped)",
                  position: "relative",
                };

                if (globalIdx < typedText.length) {
                  if (typedText[globalIdx] === text[globalIdx]) {
                    charClass = "char-correct";
                    style.color = "var(--char-correct)";
                  } else {
                    charClass = "char-mistake";
                    style.color = "var(--char-mistake)";
                    style.backgroundColor = "var(--char-mistake-bg)";
                    style.borderRadius = "2px";
                  }
                } else if (globalIdx === typedText.length) {
                  charClass = "char-current";
                  style.backgroundColor = "var(--char-current-bg)";
                  style.color = "var(--text-main)";
                  style.borderRadius = "2px";
                }

                return (
                  <span 
                    key={cIdx} 
                    className={charClass} 
                    style={style}
                  >
                    {globalIdx === typedText.length && !isPaused && (
                      <span 
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: "2px",
                          height: "100%",
                          background: "var(--char-cursor)",
                          animation: "blink 1s step-end infinite",
                        }} 
                      />
                    )}
                    {char}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
    );
  };

  // Stats Calculations for rendering
  const currentCorrect = calculateCorrectChars(typedText);
  const liveWpm = elapsedTime > 0 ? Math.round((currentCorrect / 5) / (elapsedTime / 60)) : 0;
  const liveAccuracy = totalKeysPressed > 0 
    ? Math.max(0, Math.round(((totalKeysPressed - mistakesCount) / totalKeysPressed) * 100)) 
    : 100;

  // Render SVG Chart for WPM Progression
  const renderStatsChart = () => {
    if (wpmHistory.length < 2) return null;
    
    const maxWpm = Math.max(...wpmHistory, 60);
    const minWpm = Math.min(...wpmHistory, 0);
    const range = maxWpm - minWpm;
    
    const width = 600;
    const height = 120;
    const padding = 15;
    
    const points = wpmHistory.map((val, idx) => {
      const x = padding + (idx / (wpmHistory.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minWpm) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(" ");

    return (
      <div style={{ marginTop: '1.5rem', width: '100%' }}>
        <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Speed Progression (WPM / sec)</h4>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
            {/* Gridlines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

            {/* Label values */}
            <text x={padding + 5} y={padding + 10} fill="var(--text-muted)" fontSize="8">{maxWpm} wpm</text>
            <text x={padding + 5} y={height - padding - 4} fill="var(--text-muted)" fontSize="8">{minWpm} wpm</text>

            {/* Line Path */}
            <polyline
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Dots */}
            {wpmHistory.map((val, idx) => {
              const x = padding + (idx / (wpmHistory.length - 1)) * (width - padding * 2);
              const y = height - padding - ((val - minWpm) / range) * (height - padding * 2);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="var(--color-primary)"
                  stroke="var(--bg-color)"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 1. SELECTORS BAR (Regular practicing only) */}
      {!isDailyChallenge && !focusMode && !isStarted && (
        <div 
          className="glass-card" 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            padding: '1.25rem', 
            marginBottom: '1.5rem',
            borderRadius: '12px'
          }}
        >
          {/* Mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Test Mode</label>
            <select 
              value={testMode} 
              onChange={(e) => handleSettingChange('testMode', e.target.value)}
              className="playful-select"
            >
              <option value="time">⏰ Timed practice</option>
              <option value="page">📄 Large Page block</option>
            </select>
          </div>

          {/* Duration or Page Count */}
          {testMode === 'time' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duration</label>
              <select 
                value={duration} 
                onChange={(e) => handleSettingChange('duration', Number(e.target.value))}
                className="playful-select"
              >
                <option value={60}>1 Minute</option>
                <option value={180}>3 Minutes</option>
                <option value={300}>5 Minutes</option>
                <option value={600}>10 Minutes</option>
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Page Count</label>
              <select 
                value={pageCount} 
                onChange={(e) => handleSettingChange('pageCount', Number(e.target.value))}
                className="playful-select"
              >
                <option value={1}>1 Page (~600w)</option>
                <option value={2}>2 Pages (~1200w)</option>
                <option value={5}>5 Pages (~3000w)</option>
              </select>
            </div>
          )}

          {/* Difficulty */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Difficulty</label>
            <select 
              value={difficulty} 
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
              className="playful-select"
            >
              <option value="easy">Easy (simple text)</option>
              <option value="medium">Medium (standard)</option>
              <option value="hard">Hard (complex vocabulary)</option>
            </select>
          </div>

          {/* Content Type */}
          {!hideCategorySelector && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Content Category</label>
              <select 
                value={contentType} 
                onChange={(e) => handleSettingChange('contentType', e.target.value)}
                className="playful-select"
              >
                <option value="general">General Paragraphs</option>
                <option value="practice">Speed Practice drills</option>
                <option value="quote">Famous Quotes</option>
                <option value="story">Creative Stories</option>
              </select>
            </div>
          )}

          {/* Coding Language / Natural Language Selector */}
          {!hideLanguageSelector && (
            contentType === 'coding' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Coding Syntax</label>
                <select 
                  value={codingLanguage} 
                  onChange={(e) => handleSettingChange('codingLanguage', e.target.value)}
                  className="playful-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="java">Java</option>
                  <option value="c">C Language</option>
                  <option value="cplusplus">C++</option>
                  <option value="sql">SQL Query</option>
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Language</label>
                <select 
                  value={language} 
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="playful-select"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi (हिंदी)</option>
                  <option value="gujarati">Gujarati (ગુજરાતી)</option>
                </select>
              </div>
            )
          )}
        </div>
      )}

      {/* 2. RESULTS SUMMARY VIEW */}
      {isFinished ? (
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', animation: 'float 6s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Mascot state={getMascotState()} size={110} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>
                🏁 Typing Test Completed!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Here is a summary of your typing metrics.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Speed (WPM)</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{liveWpm}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--char-correct)' }}>{liveAccuracy}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Raw WPM</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-highlight)' }}>
                {Number(((totalKeysPressed / 5) / (Math.max(1, elapsedTime) / 60)).toFixed(1))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mistakes</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--char-mistake)' }}>{mistakesCount}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time taken</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{elapsedTime}s</div>
            </div>
          </div>

          {renderStatsChart()}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={handleRestart} className="btn btn-primary">
              🔄 Try Again
            </button>
            {!isDailyChallenge && (
              <button onClick={() => fetchParagraph()} className="btn btn-secondary">
                ⏭️ Next Paragraph
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 3. ACTIVE TYPING INTERFACE */
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', position: 'relative' }}>
          {/* Stats Bar */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>WPM: </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-secondary)' }}>{liveWpm}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Accuracy: </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--char-correct)' }}>{liveAccuracy}%</span>
              </div>
              {testMode === 'page' && (
                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Typed: </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                    {typedText.length}/{text.length} ch
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {!focusMode && <Mascot state={getMascotState()} size={55} />}
              {testMode === 'time' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⏰</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: timeLeft < 10 ? 'var(--color-accent)' : 'var(--text-main)', width: '60px' }}>
                    {timeLeft}s
                  </span>
                </div>
              )}

              {/* Quick toolbar */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setFocusMode(!focusMode)} 
                  className={`btn btn-secondary`} 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                  title="Toggle Focus Mode (hides distractions)"
                >
                  👁️ {focusMode ? "Normal View" : "Focus Mode"}
                </button>
                <button 
                  onClick={() => setShowKeyboard(!showKeyboard)} 
                  className={`btn btn-secondary`} 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
                  title="Toggle Visual Keyboard"
                >
                  ⌨️ Keyboard {showKeyboard ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>

          {/* Typing Area Core Container */}
          <div 
            onClick={() => inputRef.current?.focus()}
            className="typing-box-container"
            style={{
              filter: isPaused ? 'blur(4px)' : 'none',
              transition: 'filter 0.2s',
            }}
          >
            {renderParagraph()}

            {/* Warning if not focused */}
            {isStarted && !isPaused && typeof window !== 'undefined' && document.activeElement !== inputRef.current && (
              <div 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(108, 92, 231, 0.92)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: "var(--radius-md)",
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                🖱️ Click here or press any key to resume typing!
              </div>
            )}
          </div>

          {/* Hidden text area that intercepts typing inputs securely */}
          <textarea
            ref={inputRef}
            value={typedText}
            onChange={handleInputChange}
            disabled={isFinished || isPaused || loading}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              height: 0,
              width: 0,
              pointerEvents: "none",
            }}
          />

          {/* Pause Screen Overlay */}
          {isPaused && (
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'rgba(15,17,26,0.9)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '16px',
                zIndex: 10
              }}
            >
              <h2 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Test Paused</h2>
              <button onClick={togglePause} className="btn btn-primary">
                ▶️ Resume Typing
              </button>
            </div>
          )}

          {/* Bottom buttons panel */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleRestart} className="btn btn-secondary" title="Restart test from beginning">
                🔄 Restart
              </button>
              {isStarted && (
                <button onClick={togglePause} className="btn btn-secondary">
                  {isPaused ? "▶️ Resume" : "⏸️ Pause"}
                </button>
              )}
            </div>

            {!isDailyChallenge && (
              <button onClick={() => fetchParagraph()} className="btn btn-secondary" disabled={loading}>
                ⏭️ Next Paragraph
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. DYNAMIC ON-SCREEN KEYBOARD KEYHIGHLIGHTER */}
      {!isFinished && showKeyboard && !focusMode && (
        <div style={{ marginTop: '2rem' }}>
          <Keyboard expectedKey={getExpectedKey()} />
        </div>
      )}

      {/* 5. ACTIVE SESSION LOCKING WARNING MODAL */}
      {showConfirmModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="glass-card" style={{ padding: '2rem', maxWidth: '400px', width: '90%', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>Reset Typing Session?</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              You have an active typing test in progress. Changing these settings will abort your current speed run. Do you want to proceed?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => applySettings(pendingSettings)} 
                className="btn btn-primary"
                style={{ background: 'var(--color-accent)' }}
              >
                Yes, Reset Test
              </button>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingSettings(null);
                }} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
