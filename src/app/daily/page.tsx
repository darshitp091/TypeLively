// src/app/daily/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import TypingTest from "@/components/TypingTest";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Mascot from "@/components/Mascot";

interface LeaderboardEntry {
  id: string;
  display_name: string;
  wpm: number;
  accuracy: number;
  cpm: number;
  mistakes: number;
  consistency: number;
  completion_time: number;
  created_at: string;
}

export default function DailyChallengePage() {
  const [displayName, setDisplayName] = useState<string>("");
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
  
  // Daily challenge data
  const [challenge, setChallenge] = useState<any>(null);
  const [loadingChallenge, setLoadingChallenge] = useState<boolean>(true);
  const [challengeError, setChallengeError] = useState<string>("");

  // Score & Leaderboard status
  const [testStats, setTestStats] = useState<any>(null);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string>("");
  const [streakCount, setStreakCount] = useState<number>(0);
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);

  // Check localStorage for saved name on mount & load streak
  useEffect(() => {
    const savedName = localStorage.getItem("typelively-displayname");
    if (savedName) {
      setDisplayName(savedName);
      setIsNameSubmitted(true);
    }

    try {
      const stored = localStorage.getItem("typelively-streak");
      if (stored) {
        const streakData = JSON.parse(stored);
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (streakData.lastCompletedDate === todayStr || streakData.lastCompletedDate === yesterdayStr) {
          setStreakCount(streakData.count);
        } else {
          setStreakCount(0);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [isNameSubmitted]);

  // Fetch challenge once display name is validated
  useEffect(() => {
    if (isNameSubmitted) {
      fetchDailyChallenge();
    }
  }, [isNameSubmitted]);

  // Fetch leaderboard on challenge load or score submission
  useEffect(() => {
    if (challenge) {
      fetchLeaderboard();

      // Enable Supabase Realtime subscription for live leaderboard updates!
      if (isSupabaseConfigured) {
        const channel = supabase
          .channel("leaderboard-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "daily_challenge_scores",
              filter: `challenge_id=eq.${challenge.id}`,
            },
            (payload) => {
              console.log("Realtime leaderboard update detected!");
              fetchLeaderboard();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [challenge]);

  const fetchDailyChallenge = async () => {
    setLoadingChallenge(true);
    setChallengeError("");
    try {
      const res = await fetch("/api/daily-challenge");
      const data = await res.json();
      if (data.error) {
        setChallengeError(data.error);
      } else {
        setChallenge(data);
      }
    } catch (err) {
      console.error(err);
      setChallengeError("Failed to connect to backend server.");
    } finally {
      setLoadingChallenge(false);
    }
  };

  const fetchLeaderboard = async () => {
    if (!challenge) return;
    setLoadingLeaderboard(true);
    try {
      const res = await fetch(`/api/daily-challenge/leaderboard?challengeId=${challenge.id}`);
      const data = await res.json();
      if (!data.error) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = displayName.trim().substring(0, 30);
    if (!cleanName) return;

    localStorage.setItem("typelively-displayname", cleanName);
    setDisplayName(cleanName);
    setIsNameSubmitted(true);
  };

  const handleClearName = () => {
    localStorage.removeItem("typelively-displayname");
    setIsNameSubmitted(false);
    setChallenge(null);
    setTestStats(null);
    setSubmissionSuccess(false);
  };

  const updateStreak = () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const stored = localStorage.getItem("typelively-streak");
      let streakData = stored ? JSON.parse(stored) : { lastCompletedDate: "", count: 0 };
      
      if (streakData.lastCompletedDate === todayStr) {
        setStreakCount(streakData.count);
        return;
      }
      
      let newCount = 1;
      if (streakData.lastCompletedDate === yesterdayStr) {
        newCount = streakData.count + 1;
      }
      
      const newStreakData = {
        lastCompletedDate: todayStr,
        count: newCount,
      };
      
      localStorage.setItem("typelively-streak", JSON.stringify(newStreakData));
      setStreakCount(newCount);
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  };

  const handleChallengeComplete = async (stats: any) => {
    setTestStats(stats);
    setSubmittingScore(true);
    setSubmissionError("");
    setSubmissionSuccess(false);

    try {
      const res = await fetch("/api/daily-challenge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          displayName: displayName,
          ...stats,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setSubmissionError(data.error);
      } else {
        setSubmissionSuccess(true);
        // Refresh leaderboard manually immediately
        fetchLeaderboard();
        // Update local streak count
        updateStreak();
      }
    } catch (err) {
      console.error(err);
      setSubmissionError("Network error submitting score.");
    } finally {
      setSubmittingScore(false);
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      
      {/* HEADER SECTION */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🏆 The Daily Typing Arena
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          One challenge. One layout. May the fastest fingers win.
        </p>
      </section>

      {/* GATE 1: DISPLAY NAME GATING */}
      {!isNameSubmitted ? (
        <div 
          className="glass-card" 
          style={{ 
            maxWidth: "480px", 
            margin: "0 auto", 
            padding: "2.5rem", 
            borderRadius: "16px",
            textAlign: "center"
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <Mascot state="sleepy" size={135} />
          </div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Enter Your Challenger Name</h3>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "1.75rem", lineHeight: "1.4" }}>
            No accounts or email verification required! Simply choose a display name to submit scores and rank on today's public leaderboard.
          </p>
          <form onSubmit={handleNameSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              required
              maxLength={25}
              placeholder="e.g. SpeedDemon7"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                background: "var(--bg-color)",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
                fontSize: "1.1rem",
                textAlign: "center",
                fontWeight: 600,
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.85rem" }}>
              Unlock Arena Challenge
            </button>
          </form>
        </div>
      ) : (
        /* GATED ACCESS: ACTIVE ARENA */
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          
          {/* USER CONVENIENCE HEADER */}
          <div 
            className="glass-card" 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "1rem 1.5rem", 
              borderRadius: "12px",
              fontSize: "0.95rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <span>Challenger: </span>
                <strong style={{ color: "var(--color-secondary)" }}>{displayName}</strong>
              </div>
              {streakCount > 0 && (
                <div 
                  style={{ 
                    background: "rgba(255, 118, 117, 0.15)", 
                    color: "var(--color-accent)", 
                    padding: "0.25rem 0.6rem", 
                    borderRadius: "20px", 
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    border: "1px solid var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                >
                  🔥 {streakCount}-Day Streak!
                </div>
              )}
            </div>
            <button 
              onClick={handleClearName} 
              className="btn btn-secondary" 
              style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem", borderRadius: "6px" }}
            >
              🚪 Exit Arena / Change Name
            </button>
          </div>

          {/* LOADING & CHALLENGE ERROR STATES */}
          {loadingChallenge && (
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
              <span className="logo-icon" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>⚡</span>
              <h3>Summoning today's battle arena text...</h3>
            </div>
          )}

          {challengeError && (
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center", border: "1px solid var(--color-accent)" }}>
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>❌</span>
              <h3 style={{ color: "var(--color-accent)", marginBottom: "0.5rem" }}>Failed to enter arena</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>{challengeError}</p>
              <button onClick={fetchDailyChallenge} className="btn btn-primary">Retry</button>
            </div>
          )}

          {/* ACTIVE CHALLENGE INTERFACE */}
          {challenge && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              
              {/* SURPRISE CARD (Revealing challenge metadata) */}
              <div 
                className="glass-card" 
                style={{ 
                  padding: "1.5rem", 
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.1))",
                  border: "1px solid rgba(108, 92, 231, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap"
                }}
              >
                <Mascot state="idle" size={90} />
                <div style={{ flex: 1, display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "1rem", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Challenge Type</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {challenge.mode_type === "time" ? `⏰ ${challenge.duration_value}s Time Trial` : `📄 Page Marathon`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Difficulty</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-accent)", textTransform: "capitalize" }}>
                      🔥 {challenge.difficulty}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Category</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-secondary)", textTransform: "capitalize" }}>
                      📝 {challenge.content_type === "coding" ? `Coding (${challenge.coding_language})` : challenge.content_type}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Language</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, textTransform: "capitalize" }}>
                      🌐 {challenge.language}
                    </div>
                  </div>
                </div>
              </div>

              {/* CHALLENGE TYPING ENGINE */}
              <TypingTest
                isDailyChallenge={true}
                dailyChallengeData={challenge}
                onChallengeComplete={handleChallengeComplete}
              />

              {/* SCORE SUBMISSION SYSTEM PANEL */}
              {submittingScore && (
                <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", border: "1px solid var(--color-secondary)" }}>
                  <p style={{ fontWeight: 600 }}>🛡️ Running server-side security checks & submitting score...</p>
                </div>
              )}

              {submissionError && (
                <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid var(--color-accent)", background: "rgba(214,48,49,0.1)" }}>
                  <h4 style={{ color: "var(--color-accent)", marginBottom: "0.25rem" }}>⚠️ Score Submission Blocked</h4>
                  <p style={{ fontSize: "0.9rem" }}>{submissionError}</p>
                </div>
              )}

              {submissionSuccess && (
                <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid var(--char-correct)", background: "rgba(0,184,148,0.1)", textAlign: "center" }}>
                  <h4 style={{ color: "var(--char-correct)", marginBottom: "0.25rem" }}>✅ Score Saved!</h4>
                  <p style={{ fontSize: "0.9rem" }}>Your score has been updated. Check your rank on the leaderboard below.</p>
                </div>
              )}

              {/* 6. REAL LEADERBOARD CONTAINER */}
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>⚡</span> Live Leaderboard
                  </h3>
                  <button 
                    onClick={fetchLeaderboard} 
                    className="btn btn-secondary" 
                    style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
                    disabled={loadingLeaderboard}
                  >
                    {loadingLeaderboard ? "Refreshing..." : "🔄 Refresh"}
                  </button>
                </div>

                <div className="glass-card" style={{ overflow: "hidden", borderRadius: "12px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                    <thead>
                      <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-color)" }}>
                        <th style={{ padding: "1rem" }}>Rank</th>
                        <th style={{ padding: "1rem" }}>Name</th>
                        <th style={{ padding: "1rem" }}>Speed (WPM)</th>
                        <th style={{ padding: "1rem" }}>Accuracy</th>
                        <th style={{ padding: "1rem" }}>Mistakes</th>
                        <th style={{ padding: "1rem" }}>Consistency</th>
                        <th style={{ padding: "1rem" }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                            No entries yet today. Be the first to claim the crown! 👑
                          </td>
                        </tr>
                      ) : (
                        leaderboard.map((entry, index) => {
                          const isCurrentUser = entry.display_name === displayName;
                          return (
                            <tr 
                              key={entry.id} 
                              style={{ 
                                borderBottom: "1px solid var(--border-color)",
                                background: isCurrentUser ? "rgba(108, 92, 231, 0.12)" : "transparent",
                                fontWeight: isCurrentUser ? 600 : 400
                              }}
                            >
                              <td style={{ padding: "1rem" }}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                              </td>
                              <td style={{ padding: "1rem", color: isCurrentUser ? "var(--color-secondary)" : "var(--text-main)" }}>
                                {entry.display_name} {isCurrentUser && " (You)"}
                              </td>
                              <td style={{ padding: "1rem", fontWeight: 700, color: "var(--color-primary)" }}>{entry.wpm}</td>
                              <td style={{ padding: "1rem" }}>{entry.accuracy}%</td>
                              <td style={{ padding: "1rem" }}>{entry.mistakes}</td>
                              <td style={{ padding: "1rem" }}>{entry.consistency}%</td>
                              <td style={{ padding: "1rem" }}>{entry.completion_time}s</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
