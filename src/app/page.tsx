// src/app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Mascot from "@/components/Mascot";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  } as const;

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem", position: "relative" }}>
      {/* Background blobs decor */}
      <span className="floating-icon" style={{ top: "3%", left: "-2%", fontSize: "2.5rem" }}>✨</span>
      <span className="floating-icon" style={{ top: "12%", right: "-4%", fontSize: "3rem" }}>🎈</span>
      
      {/* 1. HERO SECTION WITH MARKETING ANCHORS */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ 
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          alignItems: "center",
          gap: "3rem",
          margin: "1rem 0 5rem 0"
        }}
      >
        <motion.div variants={itemVariants}>
          <div style={{ display: "inline-block", background: "var(--gradient-peach-lavender)", padding: "0.4rem 1rem", borderRadius: "20px", color: "white", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1rem", boxShadow: "var(--shadow-sm)" }}>
            ⚡ Playful Productivity Game
          </div>
          <h1 
            style={{ 
              fontSize: "3.6rem", 
              fontWeight: 700, 
              marginBottom: "1.25rem",
              lineHeight: "1.1",
              background: "linear-gradient(135deg, var(--color-primary), var(--text-highlight))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-1.5px"
            }}
          >
            Train Your Fingers. <br />Level Up Your Typing!
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: "1.5" }}>
            TypeLively turns boring keyboard drills into an addictive, cartoon-themed speed training arena. Click-clack with synthesized mechanical switch sounds, play surprise daily matches, and code like a hacker!
          </p>
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            <Link href="/practice" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem", background: "var(--color-primary)" }}>
              🎮 Enter Practice Arena
            </Link>
            <Link href="/daily" className="btn btn-secondary" style={{ padding: "1rem 2rem", fontSize: "1.1rem", border: "3px solid var(--border-color)" }}>
              🏆 Run Daily Challenge
            </Link>
          </div>
        </motion.div>

        {/* Hero character illustration card */}
        <motion.div 
          variants={itemVariants}
          className="glass-card"
          style={{ 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            border: "3px solid var(--border-color)",
            boxShadow: "var(--shadow-lg)",
            background: "linear-gradient(135deg, #ffeaa7, #ffbe76)"
          }}
        >
          <Mascot state="idle" size={200} />
          <h2 style={{ fontSize: "1.6rem", marginTop: "1rem", color: "#2c2c54", fontFamily: "var(--font-heading)" }}>
            Clicky is waiting!
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#4b4b75", textAlign: "center", marginTop: "0.25rem" }}>
            He will wiggle, sweat, and celebrate based on your live WPM speed.
          </p>
        </motion.div>
      </motion.section>

      {/* 2. ADVERTISING SPOTLIGHT */}
      <div className="ad-slot" style={{ margin: "0 0 5rem 0" }}>
        <div>
          <div className="ad-label">Sponsor Spotlight</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>Enjoying simulated mechanical thocks? Get custom retro keycaps and mechanical keyboards today.</div>
        </div>
      </div>

      {/* 3. PLATFORM CORE FEATURES SHOWCASE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ margin: "5rem 0" }}
      >
        <h2 style={{ fontSize: "2.4rem", fontWeight: 700, textAlign: "center", marginBottom: "3.5rem" }}>
          Everything Built For Your Speed Journey
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
          
          {/* Card 1: Practice Sandbox */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Cartoon SVG: Keyboard and Settings */}
            <div style={{ height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <svg viewBox="0 0 100 80" width="120">
                <rect x="10" y="20" width="80" height="50" rx="8" fill="#ffeaa7" stroke="#2c2c54" strokeWidth="3" />
                <rect x="20" y="30" width="12" height="10" rx="3" fill="#ff7675" stroke="#2c2c54" strokeWidth="2.5" />
                <rect x="36" y="30" width="12" height="10" rx="3" fill="#6c5ce7" stroke="#2c2c54" strokeWidth="2.5" />
                <rect x="52" y="30" width="28" height="10" rx="3" fill="#00cec9" stroke="#2c2c54" strokeWidth="2.5" />
                <rect x="20" y="46" width="60" height="10" rx="3" fill="white" stroke="#2c2c54" strokeWidth="2.5" />
                <circle cx="50" cy="10" r="8" fill="#55efc4" stroke="#2c2c54" strokeWidth="2" />
                <path d="M 47,10 L 53,10 M 50,7 L 50,13" stroke="#2c2c54" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--color-primary)" }}>⚡ The Practice Sandbox</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Select customized timed runs (1, 3, 5 minutes) or complete pages. Adjust layout difficulties from easy words to hard complex vocabularies. Type in English, or toggle localized Indian scripts (Hindi, Gujarati) inside a focused sandbox.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Developer Coding Sandbox */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Cartoon SVG: Coding Developer Character */}
            <div style={{ height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <svg viewBox="0 0 100 80" width="120">
                <circle cx="50" cy="30" r="14" fill="#a8a5e6" stroke="#2c2c54" strokeWidth="3" />
                {/* Glasses */}
                <rect x="39" y="26" width="9" height="7" rx="1" fill="none" stroke="#2c2c54" strokeWidth="2" />
                <rect x="52" y="26" width="9" height="7" rx="1" fill="none" stroke="#2c2c54" strokeWidth="2" />
                <line x1="48" y1="29" x2="52" y2="29" stroke="#2c2c54" strokeWidth="2" />
                <path d="M 45,38 Q 50,42 55,38" fill="none" stroke="#2c2c54" strokeWidth="2" strokeLinecap="round" />
                <path d="M 25,65 C 25,50 75,50 75,65 Z" fill="#6c5ce7" stroke="#2c2c54" strokeWidth="3" />
                <rect x="35" y="58" width="30" height="15" rx="3" fill="#ffeaa7" stroke="#2c2c54" strokeWidth="2.5" />
                <text x="39" y="68" fill="#2c2c54" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">{"{}"}</text>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--color-secondary)" }}>💻 Developer Code Arena</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Type real coding templates line-by-line. Retains proper syntax indents, curly braces, and nested tabs. Practice code files in Python, JS, HTML, CSS, SQL, Java, C, and C++ with custom newline carriage return indicators.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Daily Challenge Arena */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Cartoon SVG: Competitor with Trophy */}
            <div style={{ height: "120px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <svg viewBox="0 0 100 80" width="120">
                <path d="M 30,20 L 70,20 L 65,50 C 60,60 40,60 35,50 Z" fill="#ffeaa7" stroke="#2c2c54" strokeWidth="3" />
                <path d="M 30,25 C 20,25 20,38 30,38" fill="none" stroke="#2c2c54" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 70,25 C 80,25 80,38 70,38" fill="none" stroke="#2c2c54" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="44" y="56" width="12" height="12" fill="#ff7675" stroke="#2c2c54" strokeWidth="3" />
                <rect x="35" y="68" width="30" height="6" rx="2" fill="#2c2c54" />
                <polygon points="50,28 53,34 60,35 55,40 56,47 50,43 44,47 45,40 40,35 47,34" fill="#ffbe76" stroke="#2c2c54" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--color-accent)" }}>🏆 The Daily Battle Arena</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Every 24 hours, the server configures a single English prose surprise matching set (timed or pages). Typists from around the world compete on the same layout. Submit runs securely to climb the public real-time leaderboard!
              </p>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* 4. SHOWCASE CLOCKY'S ANIMATED EMOTIONS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ 
          margin: "6rem 0",
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.04), rgba(0, 206, 201, 0.04))",
          padding: "3rem 2rem",
          borderRadius: "var(--radius-lg)",
          border: "3px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <h2 style={{ fontSize: "2.2rem", fontWeight: 700, textAlign: "center", marginBottom: "1rem" }}>
          Meet Clicky's Moods
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", textAlign: "center", marginBottom: "3rem" }}>
          He lives in the dashboard chrome, wiggling, sleeping, or jumping based on your current speed status.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Mascot state="idle" size={90} />
            <h4 style={{ marginTop: "0.5rem", color: "var(--text-main)" }}>Idle State</h4>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Waiting to start</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Mascot state="typing" size={90} />
            <h4 style={{ marginTop: "0.5rem", color: "var(--text-main)" }}>Typing State</h4>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Rapid wing flapping</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Mascot state="celebrating" size={90} />
            <h4 style={{ marginTop: "0.5rem", color: "var(--text-main)" }}>Celebrating</h4>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>confetti hops (Acc &gt; 90%)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Mascot state="oops" size={90} />
            <h4 style={{ marginTop: "0.5rem", color: "var(--text-main)" }}>Oops! State</h4>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Sweating mistakes encouragement</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Mascot state="sleepy" size={90} />
            <h4 style={{ marginTop: "0.5rem", color: "var(--text-main)" }}>Sleepy State</h4>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Slow breathing (loading)</span>
          </div>

        </div>
      </motion.section>

      {/* 5. FAQ SECTION */}
      <section style={{ margin: "5rem 0 2rem 0", borderTop: "3px solid var(--border-color)", paddingTop: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "3rem" }}>
          Frequently Asked Questions (FAQ)
        </h2>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <details className="glass-card" style={{ padding: "1.5rem 2rem", borderRadius: "16px", cursor: "pointer" }} open>
            <summary style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--text-main)", userSelect: "none" }}>
              How can I increase my typing speed (WPM)?
            </summary>
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.6", cursor: "default" }}>
              The key to typing faster is developing muscle memory through touch typing. Stop looking down at the keyboard, keep your hands rested on the home row (ASDF JKL;), and practice regularly. Accuracy is crucial: correcting mistakes breaks your rhythm and lowers your WPM significantly.
            </p>
          </details>

          <details className="glass-card" style={{ padding: "1.5rem 2rem", borderRadius: "16px", cursor: "pointer" }}>
            <summary style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--text-main)", userSelect: "none" }}>
              What is a good average typing speed?
            </summary>
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.6", cursor: "default" }}>
              An average typing speed is around 40 Words Per Minute (WPM). Professional typists usually clock between 70 to 90 WPM, while software developers and competitive typing enthusiasts regularly exceed 100 to 120 WPM.
            </p>
          </details>

          <details className="glass-card" style={{ padding: "1.5rem 2rem", borderRadius: "16px", cursor: "pointer" }}>
            <summary style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--text-main)", userSelect: "none" }}>
              How is WPM and accuracy calculated?
            </summary>
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.6", cursor: "default" }}>
              WPM stands for Words Per Minute. It is calculated by dividing the total number of correct characters typed by 5, and then dividing by the time in minutes. Accuracy is the percentage of correct keys typed compared to the total number of keystrokes submitted.
            </p>
          </details>

          <details className="glass-card" style={{ padding: "1.5rem 2rem", borderRadius: "16px", cursor: "pointer" }}>
            <summary style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--text-main)", userSelect: "none" }}>
              Why practice coding syntax typing?
            </summary>
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.6", cursor: "default" }}>
              Standard typing tests focus on words and sentences, but programmers mostly type braces, brackets, logic operators, and indentation. Practicing coding tests helps developers type boilerplate structures and symbols much faster with fewer coding bugs.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
