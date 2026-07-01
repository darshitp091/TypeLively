// src/lib/groq.ts
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY || '';
const isPlaceholderKey = apiKey.includes('placeholder') || !apiKey;

const groq = !isPlaceholderKey ? new Groq({ apiKey }) : null;

// Target word counts based on mode & duration/page count
export function getTargetWordCount(
  testMode: 'time' | 'page',
  duration?: number,
  pageCount?: number
): number {
  if (testMode === 'page') {
    const pages = pageCount || 1;
    if (pages === 1) return 600;
    if (pages === 2) return 1200;
    if (pages === 5) return 3000;
    return pages * 500;
  } else {
    const minutes = (duration || 60) / 60;
    // Assume average speed of 80 WPM with buffer to ensure user never runs out of text
    return Math.max(100, Math.ceil(minutes * 90));
  }
}

interface GenerateParams {
  testMode: 'time' | 'page';
  duration?: number; // in seconds, e.g. 60, 180, 300, 600
  pageCount?: number; // e.g. 1, 2, 5
  difficulty: 'easy' | 'medium' | 'hard';
  contentType: 'general' | 'practice' | 'quote' | 'story' | 'coding' | 'multilingual';
  language: 'english' | 'hindi' | 'gujarati';
  codingLanguage?: 'html' | 'css' | 'javascript' | 'python' | 'java' | 'c' | 'cplusplus' | 'sql';
}

export async function generateParagraph(params: GenerateParams): Promise<{ text: string; wordCount: number }> {
  const targetWords = getTargetWordCount(params.testMode, params.duration, params.pageCount);
  
  if (groq) {
    try {
      const codingDetail = params.contentType === 'coding' ? `Coding language: ${params.codingLanguage || 'javascript'}` : '';
      const prompt = `Generate a typing practice passage.

Requirements:
- Difficulty: ${params.difficulty}
- Test type: ${params.contentType}
- Language: ${params.language}
- ${codingDetail}
- Mode: ${params.testMode}
- Target word count: ${targetWords} words

Rules:
- Return ONLY the typing text. Do NOT include markdown blocks (like \`\`\`), HTML, titles, introductions, or explanations.
- The text must be natural, engaging, and suitable for typing practice.
- Easy = simple, short words, basic sentences, minimal punctuation.
- Medium = standard vocabulary, natural flow, standard punctuation.
- Hard = rich vocabulary, longer sentences, complex punctuation, numbers, and symbols.
- Coding mode = return realistic syntax-accurate code structure (spaces, brackets, variables, indentation) but formatted as a typeable exercise.
- Match the volume of content to the target length of exactly ${targetWords} words.
- Ensure the text contains no inappropriate or sensitive content.`;

      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: Math.min(4096, Math.max(1024, targetWords * 8)),
      });

      let text = response.choices[0]?.message?.content?.trim() || '';
      
      // Clean up markdown blocks if the LLM ignored rules
      if (text.startsWith('```')) {
        text = text.replace(/^```[a-z]*\n([\s\S]*?)\n```$/g, '$1').trim();
      }
      
      if (text) {
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        return { text, wordCount };
      }
    } catch (error) {
      console.error('Groq generation error, falling back to local generator:', error);
    }
  }

  // Local fallback generator if Groq client is not available or fails
  return generateFallback(params, targetWords);
}

// Extensive pre-defined lists for robust offline fallback typing
const FALLBACKS = {
  english: {
    easy: [
      "the quick brown fox jumps over the lazy dog",
      "we must type every day to get fast and smart",
      "she went to the shop to buy some red apples",
      "he likes to play in the park with his new dog",
      "they walked by the blue river in the morning",
      "she runs fast and plays code games all night",
      "it is good to see you here on this warm day",
      "make sure to keep your fingers on the home row",
      "press space with your thumb and type with care",
      "speed comes with time and simple practice runs"
    ],
    medium: [
      "Consistent practice is the primary key to achieving high typing speeds and exceptional accuracy.",
      "Developing muscle memory takes time; do not rush to type quickly before mastering correct finger placement.",
      "Many professional programmers and software writers spend hours refining their typing posture to prevent injury.",
      "The digital age requires us to communicate rapidly, making fluid keyboard navigation an essential modern skill.",
      "Typing tests evaluate not only your gross words per minute but also calculate the impact of errors on net speed.",
      "When you focus on error-free typing, your overall speed naturally increases as you spend less time correcting mistakes.",
      "A healthy balance between speed and precision is the hallmark of an experienced keyboard operator."
    ],
    hard: [
      "Under pressure, the coder's fingers flew across the keyboard; compiling: `g++ -O3 -Wall main.cpp -o app` failed! Code 127.",
      "Wait! Did you check the variable scope? (e.g., `let x = this.calculate(a, b);` where `a` & `b` are floats). Check line 42.",
      "Synchronous input/output multiplexing, using `select()` or `epoll()`, represents the pinnacle of high-performance servers.",
      "The rapid increase of WPM (from 60 to 125+) requires diligent, regular attention to ergonomics: keyboard angle, chair height, wrist support.",
      "She asked, 'Is this real-time leaderboard utilizing WebSocket connections, or standard long-polling AJAX requests?' - it is Supabase Realtime!",
      "An analytical approach to error analysis exposes specific trigram weaknesses: 'the', 'ing', 'ion', 'ent', and 'and'."
    ],
    quote: [
      "The only way to do great work is to love what you do. - Steve Jobs",
      "Life is what happens when you are busy making other plans. - John Lennon",
      "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
      "Be yourself; everyone else is already taken. - Oscar Wilde",
      "In the middle of difficulty lies opportunity. - Albert Einstein",
      "The journey of a thousand miles begins with one step. - Lao Tzu",
      "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson"
    ],
    story: [
      "Deep in the digital forest of Silicon Valley, a young developer named Ada was searching for the ultimate keycap. Rumor had it that typing on the mythical cap would grant anyone instant 200 WPM speed. She packed her mechanical keyboard, a set of blue switches, and a flask of coffee. After traversing through legacy codebases and debugging ancient scripts, she found the hidden chamber. On a pedestal sat a glowing keycap with the symbol 'Esc'. She placed it on her keyboard, took a deep breath, and began to type. Immediately, her fingers danced with effortless grace.",
      "The old library was quiet, except for the rhythmic click-clack of a vintage typewriter. Mr. Weaver had been writing his final novel for twelve years. He refused to use modern computers, believing that the physical resistance of metal levers gave weight to his prose. Each letter pressed stamped ink onto the parchment with a satisfying ring of the margin bell. As the rain tapped against the window pane, he typed the final sentence: 'And so, the letters faded into the paper, keeping the secrets forever.'"
    ]
  },
  hindi: {
    easy: [
      "यह एक बहुत ही सरल हिंदी टाइपिंग अभ्यास है।",
      "आपको हर दिन अभ्यास करना चाहिए ताकि आप तेज लिख सकें।",
      "वह सुबह जल्दी उठता है और सैर करने जाता है।",
      "बच्चों को बगीचे में खेलना बहुत पसंद होता है।",
      "नदी के किनारे ठंडी हवा चल रही थी।"
    ],
    medium: [
      "नियमित अभ्यास से ही किसी भी काम में निपुणता हासिल की जा सकती है, टाइपिंग भी इससे अलग नहीं है।",
      "कंप्यूटर के इस युग में हिंदी में तेजी से लिखने की क्षमता होना एक बहुत ही उपयोगी कौशल है।",
      "आपको अपने हाथ हमेशा कीबोर्ड की गृह पंक्ति यानी होम-रो पर रखने चाहिए ताकि सभी कुंजियों तक पहुंच आसान हो।",
      "शुरुआत में गति बढ़ाने के बजाय सटीकता पर ध्यान देना अधिक महत्वपूर्ण होता है।"
    ],
    hard: [
      "तकनीकी प्रगति (प्रौद्योगिकी) और इंटरनेट के प्रसार ने भारतीय भाषाओं में डिजिटल सामग्री की मांग को अत्यंत बढ़ा दिया है।",
      "क्या आपने कभी 'यूनिकोड' और 'कृतिदेव' फॉन्ट के बीच अंतर को समझा है? यह हिंदी टाइपिंग में बहुत महत्वपूर्ण है!",
      "आत्मविश्वास और निरंतरता ही सफलता की कुंजी हैं; प्रत्येक त्रुटि से सीखें और अपनी उंगलियों की गतिशीलता में सुधार करें।"
    ],
    quote: [
      "सत्य परेशान हो सकता है, पराजित नहीं।",
      "उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए। - स्वामी विवेकानंद",
      "विश्वास वह शक्ति है जिससे उजड़ी हुई दुनिया में प्रकाश लाया जा सकता है। - महात्मा गांधी"
    ],
    story: [
      "एक छोटे से गाँव में राहुल नाम का एक लड़का रहता था। उसे बचपन से ही कंप्यूटर और तकनीक का बहुत शौक था। गाँव में इंटरनेट नहीं था, लेकिन राहुल ने हिम्मत नहीं हारी। वह शहर जाकर पढ़ाई करता और छुट्टियों में गाँव आकर बच्चों को सिखाता था। धीरे-धीरे उसके प्रयासों से पूरे गाँव में शिक्षा की एक नई लहर दौड़ गई।"
    ]
  },
  gujarati: {
    easy: [
      "આ એક સરળ ગુજરાતી ટાઇપિંગ ટેસ્ટ છે.",
      "નિયમિત ટાઇપિંગ કરવાથી ઝડપ વધે છે અને ફાયદો થાય છે.",
      "બાળકોને રમકડાંથી રમવું ખૂબ જ ગમે છે.",
      "આજે સવારે સૂર્ય ખૂબ જ સારો ઉગ્યો હતો.",
      "આપણે કીબોર્ડ પર બધી આંગળીઓ વ્યવસ્થિત રાખવી જોઈએ."
    ],
    medium: [
      "ગુજરાતી ભાષામાં ટાઇપિંગ કરવાનો નિયમિત મહાવરો કરવાથી તમારી કીબોર્ડ પરની પકડ મજબૂત બનશે.",
      "આજના ડિજિટલ યુગમાં માતૃભાષામાં લખવું અને વિચારો વ્યક્ત કરવા એ ગૌરવપૂર્ણ અને મહત્વની બાબત છે.",
      "ચોકસાઈ જાળવી રાખવી એ ટાઇપિંગમાં સૌથી અગત્યનું પાસું છે, એકવાર ચોકસાઈ આવી જાય પછી ઝડપ આપોઆપ વધશે.",
      "શાંત મને અને યોગ્ય બેસવાની પદ્ધતિ સાથે ટાઇપિંગ કરવાથી થાક ઓછો લાગે છે અને ઝડપ સુધરે છે."
    ],
    hard: [
      "જ્યારે આપણે ‘શ્રુતિ’ અથવા ‘ગુજરાતી ઇનસ્ક્રિપ્ટ’ કીબોર્ડ લેઆઉટનો ઉપયોગ કરીએ છીએ, ત્યારે જોડણીની ભૂલો થવાની શક્યતા ઘટે છે.",
      "ટેકનોલોજીના માધ્યમથી સંસ્કૃતિનું જતન કરવું એ દરેક નાગરિકની નૈતિક ફરજ છે, જેમાં ભાષાકીય શુદ્ધતા અનિવાર્ય છે.",
      "વિવિધ વિરામચિહ્નો જેમ કે પ્રશ્નાર્થચિહ્ન (?), અલ્પવિરામ (,), અને અવતરણચિહ્નોનો યોગ્ય પ્રયોગ લખાણને સમૃદ્ધ બનાવે છે."
    ],
    quote: [
      "સત્ય હંમેશા વિજયી બને છે.",
      "તમે જે પણ કામ કરો, તે પૂરા દિલથી કરો.",
      "જ્યાં સુધી તમે તમારા પર વિશ્વાસ નહીં કરો, ત્યાં સુધી તમે આગળ વધી શકશો નહીં."
    ],
    story: [
      "એક સુંદર અને નાના ગામમાં આરવ નામનો છોકરો રહેતો હતો. તે ખૂબ જ મહેનતુ અને દયાળુ હતો. રોજ સવારે તે પક્ષીઓને ચણ નાખતો અને પછી શાળાએ જતો. ગામના લોકો તેને ખૂબ જ પ્રેમ કરતા હતા કારણ કે તે હંમેશા બીજાની મદદ કરવા માટે તૈયાર રહેતો હતો."
    ]
  },
  coding: {
    html: [
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>TypeLively Platform</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header id="main-header">\n    <h1>Welcome to the Arena</h1>\n  </header>\n  <main class="content-container">\n    <section class="typing-box">\n      <p>Type this code carefully!</p>\n    </section>\n  </main>\n  <footer>\n    <p>&copy; 2026 TypeLively. All rights reserved.</p>\n  </footer>\n</body>\n</html>'
    ],
    css: [
      ':root {\n  --primary-color: #6c5ce7;\n  --accent-color: #fd79a8;\n  --bg-dark: #2d3436;\n  --text-light: #dfe6e9;\n}\n\nbody {\n  margin: 0;\n  font-family: "Outfit", sans-serif;\n  background-color: var(--bg-dark);\n  color: var(--text-light);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n.typing-area {\n  border: 2px solid var(--primary-color);\n  border-radius: 12px;\n  padding: 2rem;\n  transition: transform 0.2s ease;\n}\n\n.typing-area:focus-within {\n  transform: scale(1.02);\n  box-shadow: 0 10px 20px rgba(108, 92, 231, 0.3);\n}'
    ],
    javascript: [
      'function calculateStats(charsTyped, mistakes, timeSeconds) {\n  if (timeSeconds <= 0) return { wpm: 0, accuracy: 0 };\n  \n  const timeMinutes = timeSeconds / 60;\n  const netChars = Math.max(0, charsTyped - mistakes);\n  \n  const rawWpm = (charsTyped / 5) / timeMinutes;\n  const wpm = (netChars / 5) / timeMinutes;\n  const accuracy = charsTyped > 0 ? ((charsTyped - mistakes) / charsTyped) * 100 : 0;\n  \n  return {\n    wpm: parseFloat(wpm.toFixed(2)),\n    rawWpm: parseFloat(rawWpm.toFixed(2)),\n    accuracy: parseFloat(accuracy.toFixed(2)),\n    cpm: Math.round(netChars / timeMinutes)\n  };\n}'
    ],
    python: [
      'import math\n\nclass TypingSession:\n    def __init__(self, text: str, mode: str):\n        self.text = text\n        self.mode = mode\n        self.mistakes = 0\n        self.start_time = None\n        \n    def get_word_count(self) -> int:\n        return len(self.text.split())\n        \n    def validate_score(self, wpm: float, accuracy: float) -> bool:\n        if wpm > 250.0 or accuracy < 0.0 or accuracy > 100.0:\n            return False\n        expected_cpm = wpm * 5.0\n        if expected_cpm > 1250:\n            return False\n        return True'
    ],
    java: [
      'package com.typelively.core;\n\npublic class TypingCalculator {\n    private double wpm;\n    private double accuracy;\n    \n    public TypingCalculator(int totalChars, int mistakes, double durationSeconds) {\n        double minutes = durationSeconds / 60.0;\n        this.wpm = ((totalChars - mistakes) / 5.0) / minutes;\n        this.accuracy = ((double)(totalChars - mistakes) / totalChars) * 100.0;\n    }\n    \n    public double getWpm() {\n        return this.wpm;\n    }\n    \n    public double getAccuracy() {\n        return this.accuracy;\n    }\n}'
    ],
    c: [
      '#include <stdio.h>\n#include <string.h>\n#include <time.h>\n\n#define MAX_LIMIT 1024\n\nint main() {\n    char target[] = "hello world";\n    char input[MAX_LIMIT];\n    printf("Type this: %s\\n", target);\n    \n    clock_t start = clock();\n    fgets(input, MAX_LIMIT, stdin);\n    clock_t end = clock();\n    \n    double duration = (double)(end - start) / CLOCKS_PER_SEC;\n    printf("Done in %.2f seconds\\n", duration);\n    return 0;\n}'
    ],
    cplusplus: [
      '#include <iostream>\n#include <string>\n#include <vector>\n#include <numeric>\n\ntemplate <typename T>\nT calculateAverage(const std::vector<T>& values) {\n    if (values.empty()) return 0;\n    T sum = std::accumulate(values.begin(), values.end(), 0);\n    return sum / static_cast<double>(values.size());\n}\n\nint main() {\n    std::vector<double> wpms = {85.2, 90.1, 95.5, 92.0};\n    std::cout << "Average speed: " << calculateAverage(wpms) << " WPM" << std::endl;\n    return 0;\n}'
    ],
    sql: [
      'SELECT \n    dcs.display_name,\n    dcs.wpm,\n    dcs.accuracy,\n    dcs.cpm,\n    RANK() OVER (ORDER BY dcs.score_rank_value DESC) as rank\nFROM daily_challenge_scores dcs\nJOIN daily_challenges dc ON dcs.challenge_id = dc.id\nWHERE dc.challenge_date = CURRENT_DATE\nORDER BY rank ASC\nLIMIT 100;'
    ]
  }
};

function generateFallback(params: GenerateParams, targetWords: number): { text: string; wordCount: number } {
  let sourceArray: string[] = [];

  // Determine standard source array
  if (params.contentType === 'coding') {
    const lang = params.codingLanguage || 'javascript';
    sourceArray = FALLBACKS.coding[lang] || FALLBACKS.coding.javascript;
  } else {
    const lang = params.language || 'english';
    const difficulty = params.difficulty || 'medium';
    const langData = FALLBACKS[lang] || FALLBACKS.english;
    
    if (params.contentType === 'quote') {
      sourceArray = langData.quote || langData.medium;
    } else if (params.contentType === 'story') {
      sourceArray = langData.story || langData.medium;
    } else {
      sourceArray = langData[difficulty] || langData.medium;
    }
  }

  // Compile words to reach targetWords count
  let compiledText = '';
  let wordsAdded = 0;
  
  // Keep appending items from source until we hit the target word count
  let iteration = 0;
  while (wordsAdded < targetWords && iteration < 50) {
    const item = sourceArray[Math.floor(Math.random() * sourceArray.length)];
    const words = item.split(/\s+/).filter(Boolean);
    
    if (compiledText.length > 0) {
      compiledText += params.contentType === 'coding' ? '\n\n' : ' ';
    }
    
    compiledText += item;
    wordsAdded += words.length;
    iteration++;
  }

  // Trim or adjust if excessive
  const wordsResult = compiledText.split(/\s+/).filter(Boolean);
  if (wordsResult.length > targetWords * 1.2 && params.contentType !== 'coding') {
    // If it's ordinary text and got too long, slice it to targetWords
    compiledText = wordsResult.slice(0, targetWords).join(' ');
  }

  const finalWordCount = compiledText.split(/\s+/).filter(Boolean).length;
  return { text: compiledText, wordCount: finalWordCount };
}
