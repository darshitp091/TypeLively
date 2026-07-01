// src/components/Mascot.tsx
"use client";

import React from "react";

export type MascotState = "idle" | "typing" | "celebrating" | "oops" | "sleepy";

interface MascotProps {
  state: MascotState;
  size?: number;
}

export default function Mascot({ state, size = 120 }: MascotProps) {
  // Render cartoon speech bubble comments for funny microcopy
  const getMicrocopy = (): string => {
    switch (state) {
      case "typing":
        return "Clack clack clack! ⚡";
      case "celebrating":
        return "Incredible speed! 🎉";
      case "oops":
        return "It's okay! Breathe 🌸";
      case "sleepy":
        return "Zzz... Wake me up!";
      case "idle":
      default:
        return "Ready to battle? ⚔️";
    }
  };

  return (
    <div 
      className="mascot-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`,
        position: "relative",
      }}
    >
      {/* Playful Speech Bubble */}
      <div
        className="mascot-speech"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          padding: "0.4rem 0.8rem",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "var(--text-main)",
          whiteSpace: "nowrap",
          marginBottom: "0.5rem",
          boxShadow: "var(--shadow-sm)",
          transformOrigin: "bottom center",
          animation: "float 4s ease-in-out infinite",
        }}
      >
        {getMicrocopy()}
      </div>

      {/* SVG Cartoon Bird "Clicky" */}
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{
          overflow: "visible",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          /* Float animation for idle */
          @keyframes mascotFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          /* Wiggle animation for typing */
          @keyframes mascotWiggle {
            0%, 100% { transform: rotate(-3deg) translateY(0px); }
            50% { transform: rotate(3deg) translateY(-2px); }
          }
          /* Bounce animation for celebrating */
          @keyframes mascotBounce {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-12px) scaleY(1.05) scaleX(0.95); }
          }
          /* Sleepy slow breathe */
          @keyframes mascotSleepy {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(1px) scaleY(0.96); }
          }
          /* Eye blink */
          @keyframes eyeBlink {
            0%, 95%, 100% { transform: scaleY(1); }
            97% { transform: scaleY(0.1); }
          }
          /* Wing flapping for typing */
          @keyframes leftWingFlap {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(25deg); }
          }
          @keyframes rightWingFlap {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-25deg); }
          }
          /* Floating particles for celebrating */
          @keyframes particleFloat {
            0% { transform: translateY(0px) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-20px) scale(1); opacity: 0; }
          }
          /* Sweat drop for oops */
          @keyframes sweatFall {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translate(-8px, 15px) scale(1); opacity: 0; }
          }
          /* Zzz floating for sleepy */
          @keyframes zzzFloat {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translate(12px, -20px) scale(1.1); opacity: 0; }
          }

          .clicky-body-group {
            transform-origin: bottom center;
          }
          .clicky-left-wing { transform-origin: 32px 52px; }
          .clicky-right-wing { transform-origin: 68px 52px; }
          .clicky-left-eye, .clicky-right-eye { transform-origin: center; }

          /* Apply state styles */
          .state-idle .clicky-body-group { animation: mascotFloat 3s ease-in-out infinite; }
          .state-idle .clicky-left-eye, .state-idle .clicky-right-eye { animation: eyeBlink 4s infinite; }

          .state-typing .clicky-body-group { animation: mascotWiggle 0.25s linear infinite; }
          .state-typing .clicky-left-wing { animation: leftWingFlap 0.15s linear infinite; }
          .state-typing .clicky-right-wing { animation: rightWingFlap 0.15s linear infinite; }

          .state-celebrating .clicky-body-group { animation: mascotBounce 0.4s ease-out infinite; }
          .state-celebrating .clicky-left-eye, .state-celebrating .clicky-right-eye { animation: eyeBlink 3s infinite; }

          .state-oops .clicky-body-group { animation: mascotFloat 4s ease-in-out infinite; }

          .state-sleepy .clicky-body-group { animation: mascotSleepy 5s ease-in-out infinite; }
        ` }} />

        {/* State container class */}
        <g className={`state-${state}`}>
          
          {/* CELEBRATING DECORATIONS (Stars floating) */}
          {state === "celebrating" && (
            <g>
              <polygon points="15,20 18,25 24,25 19,29 21,35 15,31 9,35 11,29 6,25 12,25" fill="#f1c40f" style={{ animation: "particleFloat 1.2s ease-out infinite", transformOrigin: "15px 20px" }} />
              <polygon points="85,30 87,33 92,33 88,36 90,41 85,38 80,41 82,36 78,33 83,33" fill="#2ecc71" style={{ animation: "particleFloat 1s ease-out infinite 0.2s", transformOrigin: "85px 30px" }} />
              <circle cx="50" cy="15" r="3" fill="#ff7675" style={{ animation: "particleFloat 1.5s ease-out infinite 0.4s" }} />
            </g>
          )}

          {/* SLEEPY DECORATIONS (Floating Zzz) */}
          {state === "sleepy" && (
            <g fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-heading)" fontWeight="800">
              <text x="75" y="45" style={{ animation: "zzzFloat 2.5s linear infinite", transformOrigin: "75px 45px" }}>Z</text>
              <text x="80" y="35" style={{ animation: "zzzFloat 2.5s linear infinite 0.8s", transformOrigin: "80px 35px" }}>z</text>
              <text x="85" y="25" style={{ animation: "zzzFloat 2.5s linear infinite 1.6s", transformOrigin: "85px 25px" }}>z</text>
            </g>
          )}

          {/* OOPS DECORATIONS (Sweat Droplet) */}
          {state === "oops" && (
            <path
              d="M 28,42 C 28,42 24,46 24,49 C 24,51 26,53 28,53 C 30,53 32,51 32,49 C 32,46 28,42 28,42 Z"
              fill="#3498db"
              style={{ animation: "sweatFall 1.8s ease-in infinite", transformOrigin: "28px 42px" }}
            />
          )}

          {/* MAIN CHARACTER BODY GROUP */}
          <g className="clicky-body-group">
            
            {/* Shadow beneath body */}
            <ellipse cx="50" cy="88" rx="22" ry="4" fill="rgba(0,0,0,0.25)" />

            {/* Little Feet */}
            <ellipse cx="38" cy="85" rx="6" ry="3" fill="#e17055" />
            <ellipse cx="62" cy="85" rx="6" ry="3" fill="#e17055" />

            {/* Left Wing */}
            <path
              className="clicky-left-wing"
              d="M 32,52 C 20,54 18,66 28,68 C 30,68 32,60 32,52 Z"
              fill={state === "celebrating" ? "#ffeaa7" : "#ffbe76"}
              stroke="#e17055"
              strokeWidth="1.5"
            />

            {/* Right Wing */}
            <path
              className="clicky-right-wing"
              d="M 68,52 C 80,54 82,66 72,68 C 70,68 68,60 68,52 Z"
              fill={state === "celebrating" ? "#ffeaa7" : "#ffbe76"}
              stroke="#e17055"
              strokeWidth="1.5"
            />

            {/* Round Fluffy Body */}
            <circle
              cx="50"
              cy="58"
              r="25"
              fill="#ffeaa7"
              stroke="#e17055"
              strokeWidth="2"
            />

            {/* Cute Chest Patch */}
            <ellipse cx="50" cy="65" rx="15" ry="12" fill="white" />

            {/* Beak / Mouth */}
            {state === "oops" ? (
              // Oops small sad beak
              <polygon points="50,60 45,55 55,55" fill="#ff7675" stroke="#d63031" strokeWidth="1.5" />
            ) : state === "celebrating" ? (
              // Celebrating big open happy beak
              <g>
                <polygon points="50,52 42,56 58,56" fill="#ff7675" stroke="#d63031" strokeWidth="1.5" />
                <path d="M 43,56 C 43,56 50,68 57,56 Z" fill="#d63031" />
                <path d="M 46,58 C 46,58 50,64 54,58 Z" fill="#ff7675" />
              </g>
            ) : (
              // Standard smiling beak
              <polygon points="50,52 44,57 56,57" fill="#ff7675" stroke="#d63031" strokeWidth="1.5" />
            )}

            {/* EYES */}
            {state === "sleepy" ? (
              // Sleepy closed curve eyes (u-shaped)
              <g stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 34,46 Q 38,50 42,46" />
                <path d="M 58,46 Q 62,50 66,46" />
              </g>
            ) : state === "oops" ? (
              // Oops concerned slanted down brows and small eyes
              <g>
                <circle cx="38" cy="46" r="3" fill="#2d3436" />
                <circle cx="62" cy="46" r="3" fill="#2d3436" />
                <path d="M 33,40 Q 38,44 43,42" stroke="#2d3436" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 67,40 Q 62,44 57,42" stroke="#2d3436" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            ) : state === "typing" ? (
              // Concentrated/focused narrow eyes
              <g fill="#2d3436">
                <ellipse cx="38" cy="46" rx="4" ry="2.5" />
                <ellipse cx="62" cy="46" rx="4" ry="2.5" />
              </g>
            ) : (
              // Idle / Celebrating big shiny anime-style eyes
              <g>
                {/* Left Eye */}
                <ellipse className="clicky-left-eye" cx="38" cy="46" rx="6.5" ry="8.5" fill="#2d3436" />
                <ellipse className="clicky-left-eye" cx="36.2" cy="43.2" rx="2.5" ry="3.5" fill="white" />
                <circle className="clicky-left-eye" cx="40.5" cy="49.5" r="1.2" fill="white" />

                {/* Right Eye */}
                <ellipse className="clicky-right-eye" cx="62" cy="46" rx="6.5" ry="8.5" fill="#2d3436" />
                <ellipse className="clicky-right-eye" cx="60.2" cy="43.2" rx="2.5" ry="3.5" fill="white" />
                <circle className="clicky-right-eye" cx="64.5" cy="49.5" r="1.2" fill="white" />
              </g>
            )}

            {/* Cute Cheek Blush */}
            <circle cx="28" cy="53" r="3.5" fill="#ff7675" opacity="0.6" />
            <circle cx="72" cy="53" r="3.5" fill="#ff7675" opacity="0.6" />

          </g>
        </g>
      </svg>
    </div>
  );
}
