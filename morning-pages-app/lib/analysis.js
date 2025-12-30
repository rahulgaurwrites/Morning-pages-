export const WORD_GOAL = 750;

// Mood keywords for analysis
const moodPatterns = {
  contemplative: ['wonder', 'think', 'perhaps', 'maybe', 'seems', 'feels', 'remember', 'imagine', 'dream', 'thought'],
  urgent: ['must', 'need', 'now', 'quickly', 'hurry', 'important', 'critical', 'immediately', 'desperate', 'urgent'],
  joyful: ['happy', 'love', 'beautiful', 'wonderful', 'amazing', 'grateful', 'joy', 'delight', 'laugh', 'smile'],
  melancholic: ['sad', 'miss', 'lost', 'gone', 'empty', 'alone', 'tired', 'heavy', 'dark', 'grey'],
  anxious: ['worry', 'afraid', 'scared', 'nervous', 'stress', 'panic', 'fear', 'anxious', 'dread', 'uncertain'],
  determined: ['will', 'must', 'going to', 'decide', 'commit', 'focus', 'achieve', 'goal', 'plan', 'ready'],
  curious: ['why', 'how', 'what if', 'wonder', 'discover', 'explore', 'question', 'curious', 'investigate', 'learn'],
  peaceful: ['calm', 'quiet', 'still', 'peace', 'gentle', 'soft', 'rest', 'breathe', 'slow', 'ease']
};

const themePatterns = {
  relationships: ['friend', 'family', 'love', 'mother', 'father', 'partner', 'child', 'brother', 'sister', 'people'],
  work: ['work', 'job', 'career', 'project', 'deadline', 'meeting', 'boss', 'colleague', 'office', 'business'],
  creativity: ['write', 'create', 'art', 'story', 'poem', 'music', 'paint', 'design', 'imagine', 'craft'],
  time: ['yesterday', 'tomorrow', 'future', 'past', 'memory', 'year', 'month', 'week', 'morning', 'night'],
  self: ['I am', 'myself', 'identity', 'who', 'become', 'grow', 'change', 'learn', 'understand', 'realize'],
  nature: ['sky', 'tree', 'water', 'sun', 'moon', 'wind', 'rain', 'earth', 'flower', 'bird'],
  home: ['home', 'room', 'house', 'door', 'window', 'bed', 'kitchen', 'space', 'place', 'belong']
};

// Writing problems detection
const writingProblems = {
  passiveVoice: {
    patterns: [/\b(was|were|been|being|is|are|am)\s+\w+ed\b/gi, /\bby\s+(the|a|an)\s+\w+/gi],
    name: 'Passive Voice Overuse',
    description: 'Your writing relies heavily on passive constructions',
    suggestion: 'Tomorrow, try rewriting sentences with the actor first.',
    exercise: 'Pick any paragraph and rewrite every sentence starting with who or what is doing the action.'
  },
  vagueLanguage: {
    patterns: [/\b(thing|stuff|something|somehow|somewhat|really|very|quite|just|basically|actually|literally)\b/gi],
    name: 'Vague Language',
    description: 'You\'re using filler words that dilute meaning',
    suggestion: 'Tomorrow, ban the word "thing" entirely.',
    exercise: 'List 10 specific nouns for objects in your room. Practice precision.'
  },
  repetitiveStarts: {
    check: (sentences) => {
      const starts = sentences.map(s => s.trim().split(' ')[0]?.toLowerCase()).filter(Boolean);
      const freq = {};
      starts.forEach(s => freq[s] = (freq[s] || 0) + 1);
      return Object.entries(freq).filter(([_, count]) => count > 3).length > 0;
    },
    name: 'Repetitive Sentence Openings',
    description: 'Many sentences start the same way',
    suggestion: 'Vary your openings: verb, prepositional phrase, dependent clause.',
    exercise: 'Write 5 sentences about the same subject, each starting differently.'
  },
  overusedI: {
    check: (text, wordCount) => {
      const iCount = (text.match(/\bI\b/g) || []).length;
      return wordCount > 100 && (iCount / wordCount) > 0.05;
    },
    name: 'I-Heavy Writing',
    description: 'The word "I" dominates your pages',
    suggestion: 'Try writing a section in second or third person.',
    exercise: 'Describe your morning routine without using "I" once.'
  },
  shortSentences: {
    check: (avgLength) => avgLength < 8,
    name: 'Choppy Rhythm',
    description: 'Sentences are consistently short',
    suggestion: 'Try combining thoughts with conjunctions.',
    exercise: 'Merge three short sentences into one flowing sentence.'
  },
  longSentences: {
    check: (avgLength) => avgLength > 30,
    name: 'Sprawling Sentences',
    description: 'Your sentences run long',
    suggestion: 'Practice the period. Stop at 20 words.',
    exercise: 'Find your longest sentence and break it into three thoughts.'
  },
  weakVerbs: {
    patterns: [/\b(is|are|was|were|be|been|being|have|has|had|do|does|did|go|went|gone|get|got|make|made)\b/gi],
    threshold: 0.15,
    name: 'Weak Verb Dependency',
    description: 'Relying on generic verbs instead of vivid ones',
    suggestion: 'Hunt for "is/was/have/get" and replace with specific verbs.',
    exercise: 'List 10 verbs that describe how people move (not walk/run).'
  },
  questionAvoidance: {
    check: (text, sentenceCount) => {
      const questions = (text.match(/\?/g) || []).length;
      return sentenceCount > 10 && questions === 0;
    },
    name: 'No Questions Asked',
    description: 'Only statements — no inquiry',
    suggestion: 'Ask at least 5 genuine questions tomorrow.',
    exercise: 'Start tomorrow with: "What am I not seeing?"'
  }
};

export function analyzeWriting(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
  
  // Detect moods
  const moodScores = {};
  Object.entries(moodPatterns).forEach(([mood, patterns]) => {
    const score = patterns.reduce((acc, pattern) => {
      const regex = new RegExp(pattern, 'gi');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
    if (score > 0) moodScores[mood] = score;
  });
  
  // Detect themes
  const themeScores = {};
  Object.entries(themePatterns).forEach(([theme, patterns]) => {
    const score = patterns.reduce((acc, pattern) => {
      const regex = new RegExp(pattern, 'gi');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
    if (score > 0) themeScores[theme] = score;
  });
  
  const topMoods = Object.entries(moodScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([mood]) => mood);
  
  const topThemes = Object.entries(themeScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme);
  
  const uniqueWords = new Set(words.filter(w => w.length > 3));
  const vocabularyRichness = words.length > 0 ? Math.round((uniqueWords.size / words.length) * 100) : 0;
  
  const wordFreq = {};
  words.filter(w => w.length > 4).forEach(w => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });
  const repeatedWords = Object.entries(wordFreq)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
  
  // Detect problems
  const detectedProblems = [];
  
  Object.entries(writingProblems).forEach(([key, problem]) => {
    let detected = false;
    
    if (problem.patterns) {
      const totalMatches = problem.patterns.reduce((acc, pattern) => {
        const matches = text.match(pattern);
        return acc + (matches ? matches.length : 0);
      }, 0);
      
      if (problem.threshold) {
        detected = wordCount > 100 && (totalMatches / wordCount) > problem.threshold;
      } else {
        detected = totalMatches > 5;
      }
    }
    
    if (problem.check) {
      if (key === 'repetitiveStarts') detected = problem.check(sentences);
      else if (key === 'overusedI') detected = problem.check(text, wordCount);
      else if (key === 'shortSentences' || key === 'longSentences') detected = problem.check(avgSentenceLength);
      else if (key === 'questionAvoidance') detected = problem.check(text, sentences.length);
    }
    
    if (detected) {
      detectedProblems.push({
        name: problem.name,
        description: problem.description,
        suggestion: problem.suggestion,
        exercise: problem.exercise
      });
    }
  });
  
  return {
    wordCount,
    sentenceCount: sentences.length,
    avgSentenceLength,
    vocabularyRichness,
    topMoods,
    topThemes,
    repeatedWords,
    problems: detectedProblems.slice(0, 3),
    progress: Math.min(100, Math.round((wordCount / WORD_GOAL) * 100))
  };
}

export function generateInsights(analysis) {
  const insights = [];
  
  const moodDescriptions = {
    contemplative: "Your mind is wandering through reflection today",
    urgent: "There's pressing energy in your words",
    joyful: "Light is breaking through your writing",
    melancholic: "You're sitting with some weight today",
    anxious: "Uncertainty is moving through these pages",
    determined: "You're gathering momentum toward something",
    curious: "Questions are alive in you today",
    peaceful: "There's stillness in your words"
  };
  
  const themeDescriptions = {
    relationships: "People are on your mind",
    work: "Your labor and purpose are surfacing",
    creativity: "The maker in you is stirring",
    time: "You're navigating between then and now",
    self: "Identity questions are circling",
    nature: "The world outside is finding its way in",
    home: "Questions of belonging and place"
  };
  
  if (analysis.topMoods.length > 0) {
    insights.push(moodDescriptions[analysis.topMoods[0]] || "Your emotional landscape is emerging");
  }
  
  if (analysis.topThemes.length > 0) {
    insights.push(themeDescriptions[analysis.topThemes[0]] || "Themes are crystallizing");
  }
  
  if (analysis.repeatedWords.length > 0) {
    insights.push(`Words you're circling: ${analysis.repeatedWords.map(w => w.word).join(', ')}`);
  }
  
  return insights;
}

export function generatePrompts(analysis) {
  if (analysis.wordCount < 200) return ["Keep going. Don't edit. Let the words fall."];
  if (analysis.wordCount < 500) return ["You're finding your rhythm. What haven't you said yet?"];
  if (analysis.wordCount < 750) return ["Almost there. What's the thing you've been avoiding?"];
  return ["You made it. Read back the first and last paragraphs together."];
}
