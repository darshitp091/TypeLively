// src/app/privacy/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - TypeLively",
  description: "Read the Privacy Policy for the TypeLively platform. Learn how we handle display names, cookie preferences, and local storage data.",
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem", maxWidth: "800px" }}>
      
      <Link href="/" style={{ color: "var(--color-secondary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem" }}>
        <span>←</span> Back to Practice
      </Link>

      <section style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>🔒 Privacy Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Last Updated: July 1, 2026</p>
      </section>

      <article style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6", fontSize: "0.95rem" }}>
        <p>
          At TypeLively, accessible from typelively.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TypeLively and how we use it.
        </p>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>1. Information We Collect</h2>
          <p>
            TypeLively is designed as a lightweight utility. We do not require account registration or email verifications for our regular sandbox or daily challenges:
          </p>
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li><strong>Display Names</strong>: If you participate in the Daily Challenge, you choose a display name. This name is sent to our backend database and saved on the public leaderboard.</li>
            <li><strong>Local Storage</strong>: We utilize local storage keys on your browser to save your display name preference, sound settings, and theme (dark/light mode) configurations.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>2. Log Files</h2>
          <p>
            TypeLively follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>3. Cookies and Web Beacons</h2>
          <p>
            Like any other website, TypeLively may use cookies to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>4. Advertising Partners Privacy Policies</h2>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on TypeLively, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>5. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </article>

    </div>
  );
}
