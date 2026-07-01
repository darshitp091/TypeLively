// src/components/ThemeSoundProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Theme = "light" | "dark";

interface ThemeSoundContextType {
  theme: Theme;
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playKeyPressSound: (type: "normal" | "space" | "backspace" | "mistake") => void;
}

const ThemeSoundContext = createContext<ThemeSoundContextType | undefined>(undefined);

export function useThemeSound() {
  const context = useContext(ThemeSoundContext);
  if (!context) {
    throw new Error("useThemeSound must be used within a ThemeSoundProvider");
  }
  return context;
}

export default function ThemeSoundProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [controlsSlot, setControlsSlot] = useState<HTMLElement | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Read configurations on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("typelively-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    const savedSound = localStorage.getItem("typelively-sound");
    if (savedSound !== null) {
      setSoundEnabled(savedSound === "true");
    }

    // Search for controls slot in header
    setControlsSlot(document.getElementById("controls-slot"));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("typelively-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const toggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    localStorage.setItem("typelively-sound", String(nextSound));
  };

  // Synthesize satisfying mechanical keyboard clicks in real-time
  const playKeyPressSound = (type: "normal" | "space" | "backspace" | "mistake") => {
    if (!soundEnabled) return;

    try {
      let ctx = audioCtx;
      if (!ctx) {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioCtx(ctx);
      }

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "normal") {
        // High click sound (like Blue mechanical switch)
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "space") {
        // Deep thock sound (like Spacebar)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "backspace") {
        // Scraping click sound
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "mistake") {
        // Dissonant error beep
        osc.type = "square";
        osc.frequency.setValueAtTime(180, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (err) {
      console.warn("Audio synthesis error:", err);
    }
  };

  const togglesContent = (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={toggleSound}
        className="btn btn-secondary"
        style={{ padding: "0.5rem", borderRadius: "8px", fontSize: "1.1rem" }}
        title={soundEnabled ? "Mute Keyboard Sounds" : "Unmute Keyboard Sounds"}
        aria-label={soundEnabled ? "Mute Keyboard Sounds" : "Unmute Keyboard Sounds"}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
      <button
        onClick={toggleTheme}
        className="btn btn-secondary"
        style={{ padding: "0.5rem", borderRadius: "8px", fontSize: "1.1rem" }}
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );

  return (
    <ThemeSoundContext.Provider value={{ theme, toggleTheme, soundEnabled, toggleSound, playKeyPressSound }}>
      {children}
      {controlsSlot && createPortal(togglesContent, controlsSlot)}
    </ThemeSoundContext.Provider>
  );
}
