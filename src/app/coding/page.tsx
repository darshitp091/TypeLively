// src/app/coding/page.tsx
"use client";

import React, { useState } from "react";
import TypingTest from "@/components/TypingTest";

type CodingLang = 'javascript' | 'python' | 'html' | 'css' | 'java' | 'c' | 'cplusplus' | 'sql';

export default function CodingPracticePage() {
  const [selectedLang, setSelectedLang] = useState<CodingLang>('javascript');
  const [testKey, setTestKey] = useState<number>(0); // force component remount on config change

  const handleLangSelect = (lang: CodingLang) => {
    setSelectedLang(lang);
    setTestKey((prev) => prev + 1);
  };

  const codingLanguages = [
    { id: 'javascript', name: 'JavaScript', logo: '🟨', desc: 'Variables, callbacks, arrow functions, promises' },
    { id: 'python', name: 'Python', logo: '🐍', desc: 'Indentation blocks, lists, loops, OOP classes' },
    { id: 'html', name: 'HTML Markup', logo: '🌐', desc: 'Angle brackets, attributes, nested tag structures' },
    { id: 'css', name: 'CSS Stylesheet', logo: '🎨', desc: 'Declarations, selectors, curly braces, colons' },
    { id: 'java', name: 'Java OOP', logo: '☕', desc: 'Class decorators, types, static methods, semi-colons' },
    { id: 'c', name: 'C Language', logo: '🔌', desc: 'Pointers, function headers, memory calls, structures' },
    { id: 'cplusplus', name: 'C++ Systems', logo: '➕', desc: 'Templates, namespaces, namespaces, streams' },
    { id: 'sql', name: 'SQL Query', logo: '📊', desc: 'JOIN, SELECT, GROUP BY, capitalization syntax' },
  ] as const;

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      
      {/* Page Header */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, var(--color-primary), var(--text-highlight))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          💻 Developer Coding Typing Test
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Train your muscle memory for special symbols, nested tabs, brackets, and syntax flows.
        </p>
      </section>

      {/* Selector Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}
      >
        {codingLanguages.map((lang) => {
          const isActive = selectedLang === lang.id;
          return (
            <div
              key={lang.id}
              onClick={() => handleLangSelect(lang.id)}
              className="glass-card"
              style={{
                padding: "1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                border: isActive ? "2px solid var(--color-secondary)" : "1px solid var(--border-color)",
                background: isActive ? "rgba(0, 206, 201, 0.08)" : "var(--bg-card)",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{lang.logo}</span>
                <h3 style={{ fontSize: "1.1rem", color: isActive ? "var(--color-secondary)" : "var(--text-main)" }}>
                  {lang.name}
                </h3>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{lang.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Typing Container */}
      <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>⌨️</span> Coding Sandbox: <span style={{ color: "var(--color-secondary)", textTransform: "capitalize" }}>{selectedLang}</span>
        </h2>
        
        {/* Render typing test specifically locked to coding settings */}
        <div key={testKey}>
          <TypingTest
            isDailyChallenge={false}
            overrideContentType="coding"
            overrideCodingLanguage={selectedLang}
            hideCategorySelector={true}
            hideLanguageSelector={true}
          />
        </div>
      </div>

      {/* Developer Typing Advice */}
      <section style={{ marginTop: "4rem", borderTop: "1px solid var(--border-color)", paddingTop: "3rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "1.5rem" }}>💡 Developer Speed Tips</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "10px" }}>
            <h4 style={{ color: "var(--color-secondary)", marginBottom: "0.5rem" }}>1. Master Bracket Pairs</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
              In programming, keys like {"`[ ]`"}, {"`{ }`"}, {"`( )`"}, and {"`< >`"} are typed frequently. Rest your pinky fingers on the edges of the keyboard to strike these keys without losing your home-row positioning.
            </p>
          </div>
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "10px" }}>
            <h4 style={{ color: "var(--text-highlight)", marginBottom: "0.5rem" }}>2. Use the Right Finger for Shift</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Always use the opposite hand's Shift key. If typing an uppercase letter or special character on the right side of the keyboard, hold the left Shift key, and vice versa. This reduces hand straining.
            </p>
          </div>
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "10px" }}>
            <h4 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>3. Embrace Tab Indentation</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Code structures rely heavily on spacing. Use the Tab key using your left pinky finger cleanly to quickly shift indentation levels without smashing the spacebar repeatedly.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
