// src/app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem", maxWidth: "600px" }}>
      
      {/* Back Link */}
      <Link href="/" style={{ color: "var(--color-secondary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem" }}>
        <span>←</span> Back to Practice
      </Link>

      <section style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>✉️ Contact Us</h1>
        <p style={{ color: "var(--text-muted)" }}>Have feedback, sponsorship proposals, or layout suggestions? Get in touch!</p>
      </section>

      {submitted ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", border: "1px solid var(--char-correct)" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>✉️</span>
          <h3 style={{ color: "var(--char-correct)", marginBottom: "0.5rem" }}>Message Sent!</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Thank you for reaching out. The TypeLively team will get back to you shortly.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn btn-secondary">Send Another Message</button>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grace Hopper"
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "var(--bg-color)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grace@example.com"
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "var(--bg-color)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your feedback here..."
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  background: "var(--bg-color)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.85rem" }} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </div>
      )}

      {/* Ad slot */}
      <div className="ad-slot" style={{ marginTop: "3rem" }}>
        <div>
          <div className="ad-label">Sponsorship Placeholder</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>Advertise with us! Reach devs and copywriters. contact@typelively.com</div>
        </div>
      </div>

    </div>
  );
}
