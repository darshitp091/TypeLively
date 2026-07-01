// src/app/blog/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Typing Guides & Posture Tutorials | TypeLively Blog",
  description: "Learn how to touch type, understand typing statistics (WPM vs CPM), and set up keyboard ergonomics to type without wrist fatigue.",
};

const ARTICLES = [
  {
    id: "touch-typing-guide",
    title: "How to Touch Type: The Ultimate Beginner's Blueprint",
    category: "Tutorial",
    desc: "A complete step-by-step walkthrough on how to train your hands to type without looking at the keyboard.",
    readTime: "5 min read",
    emoji: "⌨️",
  },
  {
    id: "wpm-vs-cpm-stats",
    title: "Understanding Typing Metrics: WPM vs Raw WPM vs CPM",
    category: "Theory",
    desc: "What do typing scores actually represent? Learn how net speed, raw speed, accuracy, and consistency metrics are calculated.",
    readTime: "4 min read",
    emoji: "📊",
  },
  {
    id: "keyboard-ergonomics",
    title: "Keyboard Ergonomics: Say Goodbye to Wrist Fatigue",
    category: "Health",
    desc: "Bad typing posture can lead to long-term strain. Follow these simple checks for desk height, wrist float, and keyboard tilt.",
    readTime: "6 min read",
    emoji: "🏥",
  },
  {
    id: "mechanical-switches",
    title: "Linear vs Tactile vs Clicky: The Developer Switch Guide",
    category: "Hardware",
    desc: "Choosing the right keyboard switch dictates your comfort and speed. Explore the pros and cons of major mechanical profiles.",
    readTime: "8 min read",
    emoji: "🔌",
  }
];

export default function BlogPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      
      {/* Header */}
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
          📖 Typing Guides & Tutorials
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Actionable resources to refine your typing posture, layout speeds, and hardware setups.
        </p>
      </section>

      {/* Articles Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "2rem",
          marginBottom: "3rem"
        }}
      >
        {ARTICLES.map((article) => (
          <article 
            key={article.id} 
            className="glass-card" 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              borderRadius: "16px",
              overflow: "hidden"
            }}
          >
            {/* Cover Graphic placeholder */}
            <div 
              style={{ 
                height: "150px", 
                background: "rgba(0,0,0,0.4)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "3.5rem",
                borderBottom: "1px solid var(--border-color)"
              }}
            >
              {article.emoji}
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: 600 }}>
                <span style={{ color: "var(--color-secondary)", textTransform: "uppercase" }}>{article.category}</span>
                <span style={{ color: "var(--text-muted)" }}>{article.readTime}</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", lineHeight: "1.3" }}>
                {article.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                {article.desc}
              </p>
              
              {/* Fake read button for MVP guides */}
              <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <span style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                  Read Article <span>→</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Tasteful Ad break */}
      <div className="ad-slot">
        <div>
          <div className="ad-label">Sponsored Banner</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>Looking to support keyboard ergonomics? Visit our mechanical keyboard partner listings.</div>
        </div>
      </div>

      {/* Quick advice newsletter signup */}
      <section 
        className="glass-card" 
        style={{ 
          padding: "2.5rem", 
          borderRadius: "16px", 
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.05), rgba(0, 206, 201, 0.05))" 
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Get Weekly Speed Tips 📬</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 1.5rem auto", lineHeight: "1.4" }}>
          Receive bite-sized layout guidelines, programming macros, and early warnings on daily typing surprises directly in your inbox.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem", maxWidth: "450px", margin: "0 auto" }}>
          <input 
            type="email" 
            placeholder="enter your email address" 
            style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "8px", 
              background: "var(--bg-color)", 
              border: "1px solid var(--border-color)", 
              color: "var(--text-main)", 
              flex: 1,
              minWidth: "200px"
            }} 
          />
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </section>

    </div>
  );
}
