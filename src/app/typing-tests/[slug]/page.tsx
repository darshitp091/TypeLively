// src/app/typing-tests/[slug]/page.tsx
import React from "react";
import TypingTest from "@/components/TypingTest";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface SeoPageData {
  title: string;
  metaDesc: string;
  header: string;
  intro: string;
  aboutText: string;
  config: {
    testMode: 'time' | 'page';
    duration?: number;
    pageCount?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    contentType?: 'general' | 'practice' | 'quote' | 'story' | 'coding' | 'multilingual';
    language?: 'english' | 'hindi' | 'gujarati';
    codingLanguage?: string;
  };
  faq: Array<{ q: string; a: string }>;
}

const SEO_PAGES: { [key: string]: SeoPageData } = {
  "1-minute-typing-test": {
    title: "1 Minute Typing Test - Quick WPM Check | TypeLively",
    metaDesc: "Take a fast 1-minute typing test online. Calculate your current speed (WPM) and accuracy. Free, instant, and mobile-friendly.",
    header: "⏱️ 1-Minute Typing Speed Test",
    intro: "Need a quick benchmark of your keyboard skills? The 1-minute typing test is the standard speed-dating round of typing metrics. Focus, relax, and type.",
    aboutText: "A 1-minute typing test is highly effective for a rapid warm-up or quick check-in. Because it is short, it demands high intensity and focus. Try to minimize mistakes as even a single error can drastically drag down your final score in a 60-second window.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "Is a 1-minute typing test accurate?", a: "Yes, it provides an excellent snapshot of your sprint speed. However, for a complete assessment of your endurance and consistency, a 3-minute or 5-minute typing test is recommended." },
      { q: "What is a good score on a 1-minute typing test?", a: "Anything above 40 WPM is average, 60+ WPM is professional, and speeds above 100 WPM are elite, placing you in the top 1% of typists globally." }
    ]
  },
  "3-minute-typing-test": {
    title: "3 Minute Typing Test - Professional WPM Evaluation | TypeLively",
    metaDesc: "Evaluate your typing proficiency with our free 3-minute typing test. Test your endurance, average speed, and precision under pressure.",
    header: "⏱️ 3-Minute Typing Speed Test",
    intro: "Step up your testing parameters. The 3-minute typing test balances speed with endurance, giving a more representative measure of daily typing tasks.",
    aboutText: "Most employment evaluations and typing certificates use a 3-to-5 minute window because it weeds out lucky runs. In 180 seconds, you must establish a steady, rhythmic pacing. If you feel your hands tiring, slow down slightly and prioritize accuracy.",
    config: { testMode: "time", duration: 180, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "Why choose a 3-minute typing test over 1-minute?", a: "A 3-minute test evaluates your typing stamina. Sprinting for 60 seconds is easy, but maintaining control for 180 seconds reveals your actual muscle memory limits." },
      { q: "How can I improve my 3-minute score?", a: "Keep your breathing steady, sit upright, and ensure your wrists do not sag on the desk. Focus on the word ahead to flow smoothly between keystrokes." }
    ]
  },
  "5-minute-typing-test": {
    title: "5 Minute Typing Test - Endurance Speed Run | TypeLively",
    metaDesc: "Take the 5-minute typing challenge. Build keyboard endurance, minimize muscle fatigue, and test your long-form accuracy.",
    header: "⏱️ 5-Minute Typing Speed Test",
    intro: "Ready for a true endurance sprint? The 5-minute typing test evaluates your ability to type continuously without losing precision.",
    aboutText: "The 5-minute typing test is highly respected in administrative exams. Fatigue often sets in around the 3-minute mark, causing errors to skyrocket. Succeeding here proves that you have excellent typing posture and efficient movement mechanics.",
    config: { testMode: "time", duration: 300, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "How hard is a 5-minute typing test?", a: "It is moderately difficult because it tests keyboard stamina. Your fingers must execute thousands of correct strokes sequentially." },
      { q: "What should I do if my wrists hurt during a 5-minute test?", a: "Stop immediately. Typing pain is a sign of bad ergonomics. Raise your chair or float your wrists slightly above the keys to prevent typing fatigue." }
    ]
  },
  "10-minute-typing-test": {
    title: "10 Minute Typing Test - Ultimate Stamina Check | TypeLively",
    metaDesc: "Challenge your keyboard stamina with the 10-minute typing test. Used for professional certification prep and transcription training.",
    header: "⏱️ 10-Minute Typing Speed Test",
    intro: "The ultimate typing marathon. Ten minutes of continuous text generation to prove your transcription speed and keyboard focus.",
    aboutText: "This test is the gold standard for medical transcriptionists, legal secretaries, and court reporters. Maintaining 80+ WPM over ten minutes without cramping require elite typing ergonomics and deep focus.",
    config: { testMode: "time", duration: 600, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "Is a 10-minute typing test necessary?", a: "It is necessary for career paths that require heavy data entry or live transcription, where typing speed must hold up over long working sessions." }
    ]
  },
  "1-page-typing-test": {
    title: "1 Page Typing Test - Document Typing Practice | TypeLively",
    metaDesc: "Type exactly 1 page of text (around 600 words) and measure your speed. A realistic way to practice typing physical documents.",
    header: "📄 1-Page Typing Practice Test",
    intro: "Rather than racing against a clock, type a full single-page document. Complete approximately 600 words at your own pace.",
    aboutText: "Page mode lets you focus on complete paragraphs. Instead of stopping abruptly when a clock rings, you get the satisfaction of finishing a document from header to footer, matching real-world office tasks.",
    config: { testMode: "page", pageCount: 1, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "How many words are in a 1-page typing test?", a: "A standard single spaced typed page contains between 500 to 600 words. Our text generator dynamically outputs a passage of this size." }
    ]
  },
  "2-page-typing-test": {
    title: "2 Page Typing Test - Long Form Writing Practice | TypeLively",
    metaDesc: "Practice typing a double-page document (approximately 1200 words). Test your long-form text entry and keyboard stamina.",
    header: "📄 2-Page Typing Practice Test",
    intro: "Double the document length. Type a comprehensive 1200-word passage to train your hands for typing reports and essays.",
    aboutText: "Two pages represent a typical university paper or business report. This test trains you to pace yourself, scroll text smoothly, and maintain steady accuracy from page one to page two.",
    config: { testMode: "page", pageCount: 2, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "How long does a 2-page test take?", a: "For an average typist (40 WPM), it takes about 30 minutes. A professional typist (80 WPM) can complete it in approximately 15 minutes." }
    ]
  },
  "5-page-typing-practice": {
    title: "5 Page Typing Practice - Mega Marathon Mode | TypeLively",
    metaDesc: "Write a complete 5-page document (around 3000 words). The ultimate typing exercise for authors, copywriters, and developers.",
    header: "📄 5-Page Mega Typing Practice",
    intro: "The ultimate typing workout. Type a massive 3000-word text block to test your typing posture, ergonomics, and mental focus.",
    aboutText: "Practicing at this volume is excellent for anyone writing novels, dissertations, or editing large documentation files. Take breaks if needed and prioritize relaxed wrist angles.",
    config: { testMode: "page", pageCount: 5, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "Can I pause during the 5-page test?", a: "Yes, you can hit the Pause button or press Escape to pause the clock and rest your fingers." }
    ]
  },
  "python-typing-test": {
    title: "Python Typing Test - Code Syntax Speed Run | TypeLively",
    metaDesc: "Practice typing Python code. Master indents, list comprehensions, logic parameters, colons, and variable naming speeds.",
    header: "🐍 Python Syntax Typing Test",
    intro: "Sharpen your Python coding speed. Type real Python syntax containing import modules, function arguments, classes, loops, and indent patterns.",
    aboutText: "Python is famous for its clean syntax, but the heavy use of colons, underscores, tabs, and parentheses can slow down developers. Practicing Python code blocks translates directly into faster code compilation.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "coding", codingLanguage: "python" },
    faq: [
      { q: "Why do programmers need a typing test?", a: "Programmers type special symbols like `_`, `:`, `*`, and `[]` way more than prose writers. Standard typing tests don't train these movements." }
    ]
  },
  "javascript-typing-test": {
    title: "JavaScript Typing Test - JS Coding Speed Test | TypeLively",
    metaDesc: "Type JavaScript code snippets. Practice curly brackets, arrow functions, async/await, semi-colons, and callback layouts.",
    header: "🟨 JavaScript Syntax Typing Test",
    intro: "Practice typing modern ES6+ JavaScript code. Master the placement of brackets, semicolons, dollar symbols, and template strings.",
    aboutText: "JavaScript uses high volumes of brackets, semi-colons, and curly braces. Training your fingers to strike these symbols without looking down makes writing JS, React, and Node scripts much more fluid.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "coding", codingLanguage: "javascript" },
    faq: [
      { q: "Does coding typing help with code bugs?", a: "Absolutely. When you type brackets and braces with correct finger placement, your syntax error rate drops significantly." }
    ]
  },
  "html-typing-test": {
    title: "HTML Typing Test - Web Syntax Practice | TypeLively",
    metaDesc: "Type HTML markup blocks. Master typing angle brackets, tag headers, properties, and nested DOM elements rapidly.",
    header: "🌐 HTML Markup Typing Test",
    intro: "Optimize your web coding. Practice typing tags, links, attributes, classes, and properties cleanly without tag nesting errors.",
    aboutText: "HTML code requires constant typing of `< >`, `/`, and `=\"\"`. This test challenges your speed on tags and nesting structure layout blocks.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "coding", codingLanguage: "html" },
    faq: [
      { q: "Is HTML typing practice useful for web designers?", a: "Yes, typing tags and attribute quotes quickly is a major speed booster for web designers and frontend developers." }
    ]
  },
  "easy-typing-test": {
    title: "Easy Typing Test - Beginner Warm Up | TypeLively",
    metaDesc: "Try our easy typing test. Designed for beginners with simple, short words, basic sentences, and low punctuation density.",
    header: "🟢 Easy Typing Speed Test",
    intro: "Just starting out? This test contains basic vocabulary, short words, and very simple sentence structures. Perfect for kids and beginners.",
    aboutText: "Easy mode removes numbers, special characters, and complex symbols. It allows you to build confidence and focus purely on finding keys on the home row.",
    config: { testMode: "time", duration: 60, difficulty: "easy", contentType: "general", language: "english" },
    faq: [
      { q: "Who should take the easy typing test?", a: "Beginners, children, or professionals looking for a simple hand warm-up before starting work." }
    ]
  },
  "medium-typing-test": {
    title: "Medium Typing Test - Standard Skill Evaluation | TypeLively",
    metaDesc: "Take the standard medium typing test. Features balanced vocabulary, natural paragraphs, and standard punctuation marks.",
    header: "🟡 Medium Typing Speed Test",
    intro: "The standard evaluation. Natural flows, regular sentences, and standard punctuation. Test your everyday typing speed.",
    aboutText: "This mode mirrors ordinary books, emails, and articles. It is the benchmark standard for evaluating typing speed for job certifications.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "Is the medium test close to real typing tasks?", a: "Yes, it perfectly represents the vocabulary density of standard business correspondence and reports." }
    ]
  },
  "hard-typing-test": {
    title: "Hard Typing Test - Advanced Skill Challenge | TypeLively",
    metaDesc: "Challenge yourself with the hard typing test. Advanced vocabulary, complex sentences, numbers, symbols, and capitals.",
    header: "🔴 Hard Typing Speed Test",
    intro: "The ultimate vocabulary test. Long, complex sentences, rich punctuation, brackets, numbers, and capitalizations.",
    aboutText: "Hard mode forces your hands out of standard typing patterns. You will encounter rare words, digits, and punctuation pairs that require deliberate keyboard movements.",
    config: { testMode: "time", duration: 60, difficulty: "hard", contentType: "general", language: "english" },
    faq: [
      { q: "Why is my WPM much lower on the hard test?", a: "Because it contains symbols, numbers, and long words that break your flow. Speed drops naturally when accuracy demands increase." }
    ]
  },
  "english-typing-test": {
    title: "English Typing Test - Roman Layout Practice | TypeLively",
    metaDesc: "Practice typing in English online. Master the standard QWERTY, Dvorak, or Colemak layouts with high-quality paragraphs.",
    header: "🇺🇸 English Typing Practice Test",
    intro: "Select your layout and practice english paragraph typing. Excellent for global communication training.",
    aboutText: "Practice on standard English vocabulary blocks. Ideal for typing tests, university studies, and office correspondence.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "general", language: "english" },
    faq: [
      { q: "Can I use Dvorak layout here?", a: "Yes. Our keyboard input capture is layout-agnostic; it matches whatever typing layout you have enabled on your operating system." }
    ]
  },
  "hindi-typing-test": {
    title: "Hindi Typing Test - हिंदी टाइपिंग अभ्यास | TypeLively",
    metaDesc: "हिंदी टाइपिंग टेस्ट ऑनलाइन. Practice typing in Hindi script. Optimize your speed on InScript or phonetic layouts.",
    header: "🇮🇳 Hindi Typing Practice Test",
    intro: "अपनी हिंदी टाइपिंग गति बढ़ाएं. Practice typing Hindi paragraphs with real-time accuracy and CPM evaluations.",
    aboutText: "Hindi is the most spoken language in India. Practicing Hindi Unicode text is crucial for government examinations, transcription careers, and local content writers.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "multilingual", language: "hindi" },
    faq: [
      { q: "Which font is used for Hindi typing?", a: "We use standard Unicode fonts which render correctly on all modern browsers and match native keyboards." }
    ]
  },
  "gujarati-typing-test": {
    title: "Gujarati Typing Test - ગુજરાતી ટાઇપિંગ ટેસ્ટ | TypeLively",
    metaDesc: "ગુજરાતી ટાઇપિંગ ટેસ્ટ. Practice typing in Gujarati online. Evaluate your words per minute on native scripts.",
    header: "🇮🇳 Gujarati Typing Practice Test",
    intro: "તમારી ગુજરાતી ટાઇપિંગ સ્પીડ વધારો. Practice typing Gujarati paragraphs and master Indic keyboard layouts.",
    aboutText: " गुजराती टायपिंग सीखें. Master Gujarati typing on Indic/Shruti layouts to write emails, articles, and documentation in Gujarati script.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "multilingual", language: "gujarati" },
    faq: [
      { q: "Can I use Google transliteration for Gujarati?", a: "Yes, you can enable Google Input Tools and type phonetically to match the Gujarati letters in the prompt." }
    ]
  },
  "coding-typing-practice": {
    title: "Coding Typing Practice - Developer Syntax Drills | TypeLively",
    metaDesc: "Practice typing code syntax. Improve typing speeds on braces, operators, indents, and logic blocks.",
    header: "💻 Coding Syntax Practice Test",
    intro: "Train your fingers for programmer-specific characters. Master nested tags, arguments, brackets, and colons.",
    aboutText: "This sandbox generates randomized programming blocks. Ideal for programmers looking to speed up typing of structural brackets and variables.",
    config: { testMode: "time", duration: 60, difficulty: "medium", contentType: "coding", codingLanguage: "javascript" },
    faq: [
      { q: "Does this support programming layouts?", a: "Yes, it generates text styled with tags, indentation, and logic syntax suitable for layout drills." }
    ]
  },
  "beginner-typing-practice": {
    title: "Beginner Typing Practice - Keyboard Training | TypeLively",
    metaDesc: "Start learning how to type. Basic home row lessons, easy words, and error-free typing guidance for beginners.",
    header: "🟢 Beginner Keyboard Practice",
    intro: "No stress, no pressure. Learn keys, get comfortable with the keyboard layout, and build initial finger coordination.",
    aboutText: "Beginner practice uses a simplified text bank to ensure you build proper finger-to-key associations before racing for high speeds.",
    config: { testMode: "time", duration: 60, difficulty: "easy", contentType: "general", language: "english" },
    faq: [
      { q: "Should I focus on speed or accuracy first?", a: "Always focus on accuracy first. Speed is a natural byproduct of muscle memory. If you type without mistakes, speed will follow." }
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(SEO_PAGES).map((slug) => ({
    slug: slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = SEO_PAGES[params.slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDesc,
  };
}

export default function SeoLandingPage({ params }: { params: { slug: string } }) {
  const page = SEO_PAGES[params.slug];

  if (!page) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: "3rem 1.5rem 5rem 1.5rem" }}>
      
      {/* Back Link */}
      <Link href="/" style={{ color: "var(--color-secondary)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem" }}>
        <span>←</span> Back to Practice
      </Link>

      {/* Page Header */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          {page.header}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", lineHeight: "1.5", maxWidth: "800px" }}>
          {page.intro}
        </p>
      </section>

      {/* ADVERTISING SLOT */}
      <div className="ad-slot">
        <div>
          <div className="ad-label">Sponsored Slot</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>Support free typing utilities by viewing our sponsors.</div>
        </div>
      </div>

      {/* TYPING ENGINE SANDBOX */}
      <section style={{ margin: "2.5rem 0" }}>
        <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem", color: "var(--text-main)" }}>
            ⚡ Live Typing Area (Preloaded Settings)
          </h2>
          <TypingTest
            isDailyChallenge={false}
            overrideTestMode={page.config.testMode}
            overrideDuration={page.config.duration}
            overridePageCount={page.config.pageCount}
            overrideDifficulty={page.config.difficulty}
            overrideContentType={page.config.contentType}
            overrideLanguage={page.config.language}
            overrideCodingLanguage={page.config.codingLanguage as any}
            hideCategorySelector={page.config.contentType === 'coding'}
            hideLanguageSelector={page.config.contentType === 'coding'}
          />
        </div>
      </section>

      {/* DETAILED CONTENT SECTION */}
      <section style={{ margin: "4rem 0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem" }}>
        {/* Left Col: Explanations */}
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "1rem" }}>
            About the {page.header}
          </h2>
          <p style={{ color: "var(--text-main)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            {page.aboutText}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            By practicing here, your speed calculations are run locally in memory to keep keystroke latency at absolute zero. Your settings are locked once you start typing to guarantee an uninterrupted typing session. Change settings beforehand or press Restart to obtain a new passage generated by our secure backend LLM pipeline.
          </p>
        </div>

        {/* Right Col: Benchmark values */}
        <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "12px", height: "fit-content" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
            📊 Speed Benchmarks
          </h3>
          <ul style={{ listStyle: "none", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span>🐢 Beginner:</span>
              <strong style={{ color: "var(--char-untyped)" }}>0 - 30 WPM</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span>🚗 Average:</span>
              <strong style={{ color: "var(--text-main)" }}>30 - 50 WPM</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span>🚀 Professional:</span>
              <strong style={{ color: "var(--color-secondary)" }}>50 - 80 WPM</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span>👑 Elite typist:</span>
              <strong style={{ color: "var(--color-primary)" }}>80+ WPM</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* SEO FAQ ACCORDION LIST */}
      <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "3rem", margin: "4rem 0 1rem 0" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, textAlign: "center", marginBottom: "2.5rem" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {page.faq.map((item, idx) => (
            <details key={idx} className="glass-card" style={{ padding: "1rem 1.5rem", borderRadius: "10px", cursor: "pointer" }} open={idx === 0}>
              <summary style={{ fontWeight: 600, fontSize: "1.1rem", color: "var(--text-main)", userSelect: "none" }}>
                {item.q}
              </summary>
              <p style={{ marginTop: "0.75rem", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.5", cursor: "default" }}>
                {item.a}
              </p>
            </details>
          ))}
          <details className="glass-card" style={{ padding: "1rem 1.5rem", borderRadius: "10px", cursor: "pointer" }}>
            <summary style={{ fontWeight: 600, fontSize: "1.1rem", color: "var(--text-main)", userSelect: "none" }}>
              Are keyboard sounds available?
            </summary>
            <p style={{ marginTop: "0.75rem", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.5", cursor: "default" }}>
              Yes. You can toggle mechanical click sounds using the speaker icon in the top header. The sound effects are synthesized dynamically using the Web Audio API with zero network latency.
            </p>
          </details>
        </div>
      </section>

    </div>
  );
}
export const dynamicParams = false;
