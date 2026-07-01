# 🎯 TypeLively

TypeLively is a premium, character-driven typing practice and typing test platform. Built with **Next.js (App Router)**, **TypeScript**, and **Supabase**, it turns keyboard drills into an addictive, cartoon-themed speed training arena.

TypeLively is built to feel like a responsive productivity game with satisfying tactile feedback, simulated mechanical switches, and surprise daily challenges to compete with typing enthusiasts worldwide.

---

## ✨ Features Spotlight

### 🐦 Expressive SVG Mascot ("Clicky")
Meet **Clicky**, your interactive typing companion. Clicky is a lightweight, self-contained React SVG mascot animated via high-performance hardware-accelerated CSS keyframes. He reacts live to your typing state:
* **`idle`**: Slow body float with blinking shiny anime eyes.
* **`typing`**: Rapid wing flapping and wiggling as you strike keys.
* **`celebrating`**: High-hopping confetti celebration if you achieve $>90\%$ accuracy.
* **`oops`**: Droopy body and sweat drops to encourage you on high-mistake runs.
* **`sleepy`**: Slow breathing Zzz clouds when data is fetching or loading.

### 🎨 Playful Neo-Brutalist Visual System
We move away from flat SaaS dashboards into a tactile bubblegum macaron canvas:
* **Tactile Inputs**: Dropdown selectors and keys feature thick outlines (`3px solid #2c2c54`) and colored offset shadows.
* **Responsive Buttons**: Buttons physically press down (`transform: translate(1px, 1px)`) with flat keycap shadows upon hover and activation.
* **Default Light Mode**: Cheerful light cream background (`#faf9fe`) with soft radial floating pastel blobs, with support for plum/midnight dark modes.
* **Zero-Lag Sliding Window**: Typing passages dynamically render a sliding window of 50 words around your cursor. This prevents DOM-tree overload and keeps input latency near zero even on 10-minute/multi-page tests.

### 🔊 Zero-Latency Mechanical Switch Synthesis
No lag, no static files. TypeLively uses the HTML5 **Web Audio API (`AudioContext`)** to synthesize satisfying keyboard soundscapes in real-time inside the browser:
* **Alphanumeric Keys**: Crisp blue clicky switch synthesis.
* **Spacebar**: Saturated thock switches.
* **Backspace**: Deep travel mechanical reset click.
* **Mistake Keys**: Low-frequency warning buzz.

### 💻 Developer Coding Sandbox
Train your finger muscle memory for brackets, curly braces, colons, and structural spacing:
* **Line-by-Line Editor**: Split code files into rows preserving nested tabs, spacing, and indents.
* **Visual Carriage Return (`↵`)**: Appends interactive Enter key indicators to guide programmers naturally through files.
* **Syntax Support**: Code typing prompts for JavaScript, Python, HTML, CSS, Java, C, C++, and SQL queries.

### 🏆 Secure Surprise Daily Challenges
* **Daily English Challenge**: The server configures a single English prose surprise set (timed or page marathon) every 24 hours.
* **Live Ranks**: Secure score evaluations on the server reject bots and validate speed-to-character metrics before writing to the public leaderboard.
* **Realtime Sync**: Submissions sync instantly to other active players using **Supabase Realtime WebSockets**.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Vanilla CSS, Framer Motion
* **Audio Engine**: Web Audio API (real-time oscillation wave synthesis)
* **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Realtime WS)
* **AI Content Generation**: Groq LLaMA-3 (Backend Server-only text compilation API)
* **Effects**: canvas-confetti

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/darshitp091/TypeLively.git
cd TypeLively
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and copy the contents of `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secure-service-role-key-backend-only
GROQ_API_KEY=gsk_your-groq-api-key-backend-only
```
> [!IMPORTANT]
> Keep `SUPABASE_SERVICE_ROLE_KEY` and `GROQ_API_KEY` strictly secret. They are only ever executed on the backend serverless edge routes, preventing API key leakage.

### 3. Initialize Database Schema
Run the following SQL migration script in your Supabase dashboard SQL Editor. This sets up the tables, indices, and strict Row Level Security (RLS) constraints.

```sql
-- Create Daily Challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE UNIQUE NOT NULL,
  mode_type VARCHAR(10) NOT NULL CHECK (mode_type IN ('time', 'page')),
  duration_value INTEGER,
  page_count INTEGER,
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  content_type VARCHAR(15) NOT NULL,
  language VARCHAR(15) NOT NULL,
  coding_language VARCHAR(15),
  generated_text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Scores table
CREATE TABLE IF NOT EXISTS daily_challenge_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  wpm NUMERIC(5,2) NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  cpm INTEGER NOT NULL,
  mistakes INTEGER NOT NULL,
  consistency NUMERIC(5,2) NOT NULL,
  completion_time NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(challenge_id, display_name)
);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_scores ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies
-- Challenges: Anyone can read, but only database inserts via admin/backend are permitted
CREATE POLICY "Allow public select challenges" 
  ON daily_challenges FOR SELECT USING (true);

-- Scores: Anyone can read, but inserts must go through the backend submission API
CREATE POLICY "Allow public select scores" 
  ON daily_challenge_scores FOR SELECT USING (true);
```

### 4. Install Dependencies & Run
```bash
# Install NPM packages
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to type!

---

## 🔒 Scoring Security & RLS Policies
To protect leaderboard integrity without email user logins:
1. **Row Level Security (RLS)** is turned on. Public anonymous keys are blocked from performing `INSERT` or `UPDATE` queries directly on database tables.
2. Users submit runs to the server API route `/api/daily-challenge/submit`.
3. The API checks inputs on the server:
   * Rejects speed runs exceeding $250\text{ WPM}$ (bot checks).
   * Validates typing time to character count ratios mathematically.
   * Cleans names and formats values before inserting them using the secure `SUPABASE_SERVICE_ROLE_KEY` client.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
