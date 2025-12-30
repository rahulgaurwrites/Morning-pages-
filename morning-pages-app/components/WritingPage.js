'use client';

import { useState, useEffect } from 'react';
import { analyzeWriting, generateInsights, generatePrompts, WORD_GOAL } from '@/lib/analysis';
import { calculateCurrentStreak, updateStreakData, saveTodayText, loadTodayText } from '@/lib/streak';
import AIAnalysis from './AIAnalysis';

export default function WritingPage({ onBack }) {
  const [text, setText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const analysis = analyzeWriting(text);
  const insights = generateInsights(analysis);
  const prompts = generatePrompts(analysis);
  
  useEffect(() => {
    setMounted(true);
    const saved = loadTodayText();
    if (saved) {
      setText(saved);
      const savedAnalysis = analyzeWriting(saved);
      if (savedAnalysis.wordCount >= WORD_GOAL) {
        setHasCompletedToday(true);
      }
    }
    setCurrentStreak(calculateCurrentStreak());
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    if (text.length > 0) {
      saveTodayText(text);
      setLastSaved(new Date().toLocaleTimeString());
      
      if (analysis.wordCount >= WORD_GOAL && !hasCompletedToday) {
        setHasCompletedToday(true);
        updateStreakData(analysis.wordCount, true);
        setCurrentStreak(calculateCurrentStreak());
      }
    }
  }, [text, analysis.wordCount, hasCompletedToday, mounted]);
  
  const progressColor = analysis.progress < 33 ? '#e74c3c' : 
                        analysis.progress < 66 ? '#f39c12' : 
                        analysis.progress < 100 ? '#27ae60' : '#9b59b6';
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0b' }}>
        <div className="text-2xl" style={{ color: '#504945' }}>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0b', color: '#e8e6e3' }}>
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-2xl p-2 transition-colors hover:opacity-70"
            style={{ background: 'transparent', border: 'none', color: '#665c54', cursor: 'pointer' }}
          >
            ←
          </button>
          <div>
            <h1 className="text-base uppercase tracking-widest" style={{ color: '#a89984' }}>
              Morning Pages
            </h1>
            <p className="text-xs mt-1" style={{ color: '#504945' }}>
              {currentDate}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded"
              style={{ background: 'rgba(215,153,33,0.1)' }}>
              <span>🔥</span>
              <span className="font-mono font-semibold" style={{ color: '#d79921' }}>
                {currentStreak}
              </span>
            </div>
          )}
          
          {lastSaved && (
            <span className="text-xs" style={{ color: '#3c3836' }}>
              saved {lastSaved}
            </span>
          )}
          
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-2 px-3 py-2 rounded text-xs uppercase tracking-wide transition-all"
            style={{
              background: showAnalysis ? 'rgba(139,92,246,0.15)' : 'transparent',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#8b5cf6',
              cursor: 'pointer'
            }}
          >
            <span>🤖</span>
            {showAnalysis ? 'Hide' : 'Analyze'}
          </button>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="h-1 relative" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div 
          className="h-full transition-all duration-300"
          style={{
            width: `${analysis.progress}%`,
            background: progressColor,
            boxShadow: `0 0 20px ${progressColor}40`,
          }} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex max-w-7xl mx-auto" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Writing area */}
        <main className="flex-1 p-8 flex flex-col">
          {/* Word count */}
          <div className="mb-4 flex items-baseline gap-2">
            <span 
              className="text-5xl font-light font-mono transition-colors"
              style={{ color: progressColor }}
            >
              {analysis.wordCount}
            </span>
            <span style={{ color: '#504945' }}>/ {WORD_GOAL}</span>
            {analysis.wordCount >= WORD_GOAL && (
              <span className="ml-3 text-sm italic" style={{ color: '#9b59b6' }}>
                ✓ complete
              </span>
            )}
          </div>
          
          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing. Don't think. Don't edit. Just let the words come..."
            autoFocus
            className="flex-1 resize-none outline-none"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d5c4a1',
              fontSize: '1.2rem',
              lineHeight: 1.9,
              fontFamily: "'EB Garamond', Georgia, serif",
              minHeight: '70vh',
            }}
          />
        </main>
        
        {/* Analysis panel */}
        {showAnalysis && (
          <aside 
            className="w-96 p-5 overflow-y-auto"
            style={{ 
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.3)',
              maxHeight: 'calc(100vh - 80px)'
            }}
          >
            {analysis.wordCount < 50 ? (
              <p className="mt-6 italic" style={{ color: '#504945', lineHeight: 1.7 }}>
                Keep writing. Analysis appears after 50 words.
              </p>
            ) : (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { value: analysis.sentenceCount, label: 'sentences' },
                    { value: analysis.avgSentenceLength, label: 'avg length' },
                    { value: `${analysis.vocabularyRichness}%`, label: 'vocab' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-2 rounded text-center"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="text-lg font-mono" style={{ color: '#a89984' }}>
                        {stat.value}
                      </div>
                      <div className="text-xs uppercase tracking-wide" style={{ color: '#504945' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Moods & Themes */}
                <div className="flex gap-3 mb-5">
                  {analysis.topMoods.length > 0 && (
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide mb-2" style={{ color: '#504945' }}>
                        Mood
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {analysis.topMoods.slice(0, 2).map(mood => (
                          <span key={mood} className="px-2 py-1 rounded text-xs capitalize"
                            style={{ background: 'rgba(155,89,182,0.15)', color: '#b794c0' }}>
                            {mood}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.topThemes.length > 0 && (
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide mb-2" style={{ color: '#504945' }}>
                        Theme
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {analysis.topThemes.slice(0, 2).map(theme => (
                          <span key={theme} className="px-2 py-1 rounded text-xs capitalize"
                            style={{ background: 'rgba(39,174,96,0.15)', color: '#7dba94' }}>
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Insights */}
                {insights.length > 0 && (
                  <div className="mb-5">
                    {insights.slice(0, 2).map((insight, i) => (
                      <p key={i} className="text-sm mb-2 pl-3 italic"
                        style={{ 
                          color: '#a89984', 
                          lineHeight: 1.5,
                          borderLeft: '2px solid rgba(255,255,255,0.08)'
                        }}>
                        {insight}
                      </p>
                    ))}
                  </div>
                )}
                
                {/* Prompts */}
                {prompts.length > 0 && (
                  <div className="mb-5">
                    {prompts.map((prompt, i) => (
                      <div key={i} className="p-3 rounded text-sm"
                        style={{ background: 'rgba(215,153,33,0.08)', color: '#d79921' }}>
                        {prompt}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Basic Problems */}
                {analysis.problems.length > 0 && analysis.wordCount >= 200 && (
                  <div className="mb-5">
                    <div className="text-xs uppercase tracking-wide mb-3" style={{ color: '#e74c3c' }}>
                      Quick Craft Notes
                    </div>
                    {analysis.problems.slice(0, 2).map((problem, i) => (
                      <div key={i} className="mb-2 p-3 rounded"
                        style={{ 
                          background: 'rgba(231,76,60,0.06)',
                          borderLeft: '2px solid rgba(231,76,60,0.3)'
                        }}>
                        <div className="text-sm mb-1" style={{ color: '#e8e6e3' }}>
                          {problem.name}
                        </div>
                        <div className="text-xs" style={{ color: '#928374' }}>
                          {problem.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* AI Analysis */}
                <AIAnalysis text={text} wordCount={analysis.wordCount} />
                
                {/* Completion */}
                {analysis.wordCount >= WORD_GOAL && (
                  <div className="mt-5 p-4 rounded-lg text-center"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(155,89,182,0.1), rgba(142,68,173,0.1))',
                      border: '1px solid rgba(155,89,182,0.2)'
                    }}>
                    <div className="text-2xl mb-2">✨</div>
                    <div className="font-medium" style={{ color: '#b794c0' }}>
                      Pages Complete
                    </div>
                    <div className="text-xs mt-1 italic" style={{ color: '#665c54' }}>
                      You showed up. That's what matters.
                    </div>
                  </div>
                )}
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
