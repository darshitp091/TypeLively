// src/app/terms/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - TypeLively",
  description: "Read the Terms of Service for TypeLively. Understand our terms regarding leaderboard submissions, anti-cheat policies, and service limits.",
};

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem", maxWidth: "800px" }}>
      
      <Link href="/" style={{ color: "var(--color-secondary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem" }}>
        <span>←</span> Back to Practice
      </Link>

      <section style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>📋 Terms of Service</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Last Updated: July 1, 2026</p>
      </section>

      <article style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6", fontSize: "0.95rem" }}>
        <p>
          Welcome to TypeLively! These terms and conditions outline the rules and regulations for the use of TypeLively's Website, located at typelively.vercel.app.
        </p>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>1. Acceptance of Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use TypeLively if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>2. Leaderboard & Scoring Rules (Anti-Cheat Policy)</h2>
          <p>
            TypeLively provides a public Daily Challenge Leaderboard. To keep competition fair and fun:
          </p>
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>You agree not to utilize automated bots, keyboard macros, auto-typers, or script injectors to submit fake scores.</li>
            <li>We utilize server-side mathematical validation checks on all scores. Any submission that fails these sanity checks (e.g. impossible speeds or characters-to-speed ratios) will be automatically rejected.</li>
            <li>We reserve the right to prune or delete entries that are deemed fraudulent or offensive without prior warning.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>3. Intellectual Property</h2>
          <p>
            Unless otherwise stated, TypeLively and/or its licensors own the intellectual property rights for all material on TypeLively. All intellectual property rights are reserved. You may access this from TypeLively for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>4. Disclaimer of Warranties</h2>
          <p>
            This website is provided "as is," with all faults, and TypeLively expresses no representations or warranties, of any kind related to this website or the materials contained on this website. Also, nothing contained on this website shall be interpreted as advising you.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>5. Limitation of Liability</h2>
          <p>
            In no event shall TypeLively, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. TypeLively, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
          </p>
        </div>
      </article>

    </div>
  );
}
