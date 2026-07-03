// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ThemeSoundProvider from "@/components/ThemeSoundProvider";

export const metadata: Metadata = {
  title: "TypeLively - 100% Free Typing Test & Code Typing Practice",
  description: "Improve your typing speed and accuracy with TypeLively. 100% free with zero ads. Daily challenges, developer coding sandbox, and real-time leaderboards.",
  keywords: "typing test, free typing test, no ads typing test, coding typing practice, typing practice, wpm calculator, daily typing challenge, mechanical keyboard simulator",
  openGraph: {
    title: "TypeLively - 100% Free Typing Test & Code Practice",
    description: "Train your fingers with TypeLively! 100% free with absolutely zero ads. Play daily challenges, enjoy mechanical keyboard sounds, and practice real coding syntax.",
    type: "website",
    url: "https://www.typelively.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeLively - Free Ad-Free Typing Platform",
    description: "Practice typing daily challenges and coding syntax with simulated mechanical keyboard clicks.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('typelively-theme');
                  const theme = savedTheme === 'dark' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TypeLively",
              "operatingSystem": "All",
              "applicationCategory": "EducationalApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Improve your typing speed and accuracy with TypeLively. 100% free with zero ads. Daily challenges, developer coding sandbox, and real-time leaderboards.",
              "browserRequirements": "Requires JavaScript. Requires HTML5."
            })
          }}
        />
      </head>
      <body>
        <ThemeSoundProvider>
          {/* Skip link for keyboard accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <header>
            <div className="container header-inner">
              <Link href="/" className="logo" aria-label="TypeLively Home">
                <span className="logo-icon" aria-hidden="true">🎯</span>
                <span>TypeLively</span>
              </Link>

              <nav aria-label="Main Navigation">
                <Link href="/practice">Practice</Link>
                <Link href="/daily">Daily Challenge</Link>
                <Link href="/coding">Coding</Link>
                <Link href="/blog">Guides</Link>
                <Link href="/about">About</Link>
              </nav>

              {/* Theme and Sound Toggles (Rendered Client-side) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a 
                  href="https://github.com/darshitp091/TypeLively"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-star-button"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  <span>Star</span>
                  <span style={{ background: 'rgba(255,255,255,0.18)', padding: '0.02rem 0.25rem', borderRadius: '4px', fontSize: '0.7rem' }}>⭐</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="controls-slot" />
              </div>
            </div>
          </header>

          <main id="main-content" style={{ flex: 1 }}>
            {children}
          </main>

          <footer>
            <div className="container">
              <div className="footer-grid">
                <div className="footer-col">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎯</span> TypeLively
                  </h4>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
                    The addictive typing arena built for coders, writers, and keyboard enthusiasts. Enhance your speed, master layouts, and climb the daily leaderboards.
                  </p>
                  <a 
                    href="https://github.com/sponsors/darshitp091" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sponsor-footer-button"
                  >
                    <span>💖 Sponsor Project</span>
                  </a>
                </div>
                <div className="footer-col">
                  <h4>Typing Tests</h4>
                  <ul>
                    <li><Link href="/typing-tests/1-minute-typing-test">1 Minute Test</Link></li>
                    <li><Link href="/typing-tests/3-minute-typing-test">3 Minute Test</Link></li>
                    <li><Link href="/typing-tests/5-minute-typing-test">5 Minute Test</Link></li>
                    <li><Link href="/typing-tests/1-page-typing-test">1 Page Test</Link></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Specialized Practice</h4>
                  <ul>
                    <li><Link href="/coding">Coding Practice</Link></li>
                    <li><Link href="/typing-tests/python-typing-test">Python Syntax</Link></li>
                    <li><Link href="/typing-tests/javascript-typing-test">JavaScript Syntax</Link></li>
                    <li><Link href="/practice">Multilingual Practice</Link></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Legal & Info</h4>
                  <ul>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/privacy">Privacy Policy</Link></li>
                    <li><Link href="/terms">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                <p>&copy; {new Date().getFullYear()} TypeLively. Built for speed, security, and typographic glory.</p>
              </div>
            </div>
          </footer>
        </ThemeSoundProvider>
      </body>
    </html>
  );
}
