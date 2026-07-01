// src/app/practice/page.tsx
"use client";

import React from "react";
import TypingTest from "@/components/TypingTest";

export default function PracticePage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
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
          ⚡ Typing Practice Sandbox
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Train your muscle memory, toggle mechanical thocks, and enhance your word speed runs.
        </p>
      </section>

      <section style={{ margin: "2rem 0" }}>
        <TypingTest />
      </section>
    </div>
  );
}
