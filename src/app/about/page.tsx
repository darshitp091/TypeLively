// src/app/about/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Us - The TypeLively Mission | TypeLively",
  description: "Learn about the design strategy, engineering stacks, and security protocols behind the TypeLively typing platform.",
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem", maxWidth: "800px" }}>
      
      {/* Back Link */}
      <Link href="/" style={{ color: "var(--color-secondary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem" }}>
        <span>←</span> Back to Sandbox
      </Link>

      <section style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "1rem" }}>🎯 About TypeLively</h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
          TypeLively is a startup-quality, playful, and secure web application designed to make practicing keyboard typing addictive, fast, and competitive.
        </p>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--color-primary)" }}>Our Core Philosophy</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "var(--text-main)" }}>
            Many modern typing platforms feel either like boring corporate SaaS templates or childish cartoon overloads. TypeLively is crafted as a middle ground: a **playful productivity game** featuring sleek glassmorphic themes, responsive micro-animations, and synthesized mechanical keyboard click feedback.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--color-secondary)" }}>Engineering and Architecture</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "var(--text-main)", marginBottom: "1rem" }}>
            The app utilizes a modern serverless stack to maintain speed and strict security:
          </p>
          <ul style={{ listStyle: "circle", paddingLeft: "1.5rem", fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>
              <strong>Fast Local Calculations</strong>: All keystroke evaluations, accuracy rates, and WPM speeds are calculated in client-side memory to keep input processing latencies at absolute zero.
            </li>
            <li>
              <strong>Groq-based Backend Pipeline</strong>: Typing passages are generated dynamically using LLMs hosted on the Groq Cloud API, executed strictly backend-side to secure our private keys.
            </li>
            <li>
              <strong>Supabase Database Layer</strong>: Challenge configurations and player rankings are saved in a Postgres instance. Write operations bypass Row Level Security via secure backend validation checks, completely locking out client-side leaderboard spoofing.
            </li>
            <li>
              <strong>Real-time Multiplayer Vibe</strong>: Leaderboards subscribe to Postgres updates via Supabase WebSockets, updating player standings live on completion.
            </li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--text-highlight)" }}>Keyboard Audio Synthesis</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "var(--text-main)" }}>
            Instead of forcing users to download heavy audio sound libraries, TypeLively uses the HTML5 Web Audio API to synthesize mechanical key clicks in real-time. Correct keys trigger a bright blue switch click, spacebars trigger a deep thock, backspaces tick, and typos emit a low buzz.
          </p>
        </div>
      </section>

      {/* Ad slot */}
      <div className="ad-slot" style={{ marginTop: "3.5rem" }}>
        <div>
          <div className="ad-label">Sponsor Marketplace</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>Support free typing software. Explore custom mechanical keyboard layouts.</div>
        </div>
      </div>

    </div>
  );
}
