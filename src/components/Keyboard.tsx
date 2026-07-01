// src/components/Keyboard.tsx
"use client";

import React, { useEffect, useState } from "react";

interface KeyboardProps {
  expectedKey: string | null;
}

export default function Keyboard({ expectedKey }: KeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toUpperCase();
      if (e.code === "Space") key = "SPACE";
      setActiveKeys((prev) => ({ ...prev, [key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let key = e.key.toUpperCase();
      if (e.code === "Space") key = "SPACE";
      setActiveKeys((prev) => ({ ...prev, [key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getCleanExpectedKey = (char: string | null): string => {
    if (!char) return "";
    if (char === " ") return "SPACE";
    if (char === "\n") return "ENTER";
    return char.toUpperCase();
  };

  const currentExpected = getCleanExpectedKey(expectedKey);
  const requiresShift = expectedKey !== null && expectedKey !== " " && expectedKey !== "\n" && expectedKey !== expectedKey.toLowerCase();

  const isHighlighted = (keySymbol: string): boolean => {
    return !!activeKeys[keySymbol];
  };

  const isExpected = (keySymbol: string): boolean => {
    if (keySymbol === currentExpected) return true;
    if (keySymbol === "SHIFT" && requiresShift) return true;
    return false;
  };

  const renderKey = (label: string, symbol: string, widthFlex = 1, uniqueId?: string) => {
    const active = isHighlighted(symbol);
    const expected = isExpected(symbol);

    let className = "keyboard-key";
    if (active) className += " active";
    if (expected) className += " expected";

    return (
      <div
        key={uniqueId || symbol}
        className={className}
        style={{
          flex: widthFlex,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "42px",
          margin: "3px",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          fontSize: "0.85rem",
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
          cursor: "default",
          userSelect: "none",
          transition: "all 0.08s ease",
          background: active 
            ? "var(--color-secondary)" 
            : expected 
              ? "rgba(108, 92, 231, 0.25)" 
              : "rgba(0, 0, 0, 0.15)",
          color: active 
            ? "white" 
            : expected 
              ? "var(--color-primary)" 
              : "var(--text-muted)",
          boxShadow: expected ? "0 0 10px rgba(108, 92, 231, 0.4)" : "none",
        }}
      >
        {label}
      </div>
    );
  };

  // Keyboard Rows definition
  const row1 = [
    { label: "`", symbol: "`" },
    { label: "1", symbol: "1" },
    { label: "2", symbol: "2" },
    { label: "3", symbol: "3" },
    { label: "4", symbol: "4" },
    { label: "5", symbol: "5" },
    { label: "6", symbol: "6" },
    { label: "7", symbol: "7" },
    { label: "8", symbol: "8" },
    { label: "9", symbol: "9" },
    { label: "0", symbol: "0" },
    { label: "-", symbol: "-" },
    { label: "=", symbol: "=" },
    { label: "Backspace", symbol: "BACKSPACE", flex: 2 },
  ];

  const row2 = [
    { label: "Tab", symbol: "TAB", flex: 1.5 },
    { label: "Q", symbol: "Q" },
    { label: "W", symbol: "W" },
    { label: "E", symbol: "E" },
    { label: "R", symbol: "R" },
    { label: "T", symbol: "T" },
    { label: "Y", symbol: "Y" },
    { label: "U", symbol: "U" },
    { label: "I", symbol: "I" },
    { label: "O", symbol: "O" },
    { label: "P", symbol: "P" },
    { label: "[", symbol: "[" },
    { label: "]", symbol: "]" },
    { label: "\\", symbol: "\\" },
  ];

  const row3 = [
    { label: "Caps", symbol: "CAPSLOCK", flex: 1.8 },
    { label: "A", symbol: "A" },
    { label: "S", symbol: "S" },
    { label: "D", symbol: "D" },
    { label: "F", symbol: "F" },
    { label: "G", symbol: "G" },
    { label: "H", symbol: "H" },
    { label: "J", symbol: "J" },
    { label: "K", symbol: "K" },
    { label: "L", symbol: "L" },
    { label: ";", symbol: ";" },
    { label: "'", symbol: "'" },
    { label: "Enter", symbol: "ENTER", flex: 2.2 },
  ];

  const row4 = [
    { label: "Shift", symbol: "SHIFT", flex: 2.5 },
    { label: "Z", symbol: "Z" },
    { label: "X", symbol: "X" },
    { label: "C", symbol: "C" },
    { label: "V", symbol: "V" },
    { label: "B", symbol: "B" },
    { label: "N", symbol: "N" },
    { label: "M", symbol: "M" },
    { label: ",", symbol: "," },
    { label: ".", symbol: "." },
    { label: "/", symbol: "/" },
    { label: "Shift", symbol: "SHIFT", flex: 2.5 },
  ];

  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "1.5rem auto 0 auto",
        padding: "0.75rem",
        borderRadius: "12px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        boxShadow: "inset 0 4px 10px rgba(0,0,0,0.3)",
      }}
      aria-hidden="true"
    >
      <div style={{ display: "flex" }}>{row1.map((k, idx) => renderKey(k.label, k.symbol, k.flex, `${k.symbol}-${idx}`))}</div>
      <div style={{ display: "flex" }}>{row2.map((k, idx) => renderKey(k.label, k.symbol, k.flex, `${k.symbol}-${idx}`))}</div>
      <div style={{ display: "flex" }}>{row3.map((k, idx) => renderKey(k.label, k.symbol, k.flex, `${k.symbol}-${idx}`))}</div>
      <div style={{ display: "flex" }}>{row4.map((k, idx) => renderKey(k.label, k.symbol, k.flex, `${k.symbol}-${idx}`))}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {renderKey("Spacebar", "SPACE", 6.5, "SPACE-0")}
      </div>
    </div>
  );
}
