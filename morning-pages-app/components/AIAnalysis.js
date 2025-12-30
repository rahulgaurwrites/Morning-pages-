'use client';

import { useState } from 'react';

export default function AIAnalysis({ text, wordCount }) {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const runAIAnalysis = async () => {
    if (wordCount < 200) {
      setError('Write at least 200 words for AI analysis');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const analysis = await response.json();
      setAiAnalysis(analysis);
      setHasAnalyzed(true);
    } catch (err) {
      console.error('AI Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!hasAnalyzed) {
    return (
      <div className="mt-4 p-5 rounded-lg border"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))',
          borderColor: 'rgba(139,92,246,0.2)'
        }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">🤖</span>
          <span className="text-sm font-medium" style={{ color: '#b794c0' }}>
            Deep AI Analysis
          </span>
        </div>
        <p className="text-sm mb-4" style={{ color: '#928374', lineHeight: 1.5 }}>
          Get personalized feedback on your voice, hidden strengths, specific weaknesses, and a sentence-level revision example.
        </p>
        <button
          onClick={runAIAnalysis}
          disabled={isLoading || wordCount < 200}
          className="w-full py-3 px-4 rounded text-sm font-medium transition-all"
          style={{
            background: isLoading 
              ? 'rgba(139,92,246,0.2)' 
              : wordCount < 200 
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            color: wordCount < 200 ? '#504945' : '#fff',
            cursor: wordCount < 200 ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Analyzing...' : wordCount < 200 ? `Need ${200 - wordCount} more words` : 'Run Deep Analysis'}
        </button>
        {error && (
          <p className="text-xs mt-3" style={{ color: '#e74c3c' }}>{error}</p>
        )}
      </div>
    );
  }
  
  if (!aiAnalysis) return null;
  
  return (
    <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.2)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span>🤖</span>
        <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#8b5cf6' }}>
          AI Deep Analysis
        </span>
      </div>
      
      {/* Voice & Emotional Undercurrent */}
      <div className="mb-4 p-3 rounded" 
        style={{ 
          background: 'rgba(139,92,246,0.06)', 
          borderLeft: '3px solid rgba(139,92,246,0.4)' 
        }}>
        <p className="text-sm italic" style={{ color: '#d5c4a1', lineHeight: 1.6 }}>
          {aiAnalysis.voiceObservation}
        </p>
        <p className="text-sm mt-2" style={{ color: '#928374', lineHeight: 1.5 }}>
          {aiAnalysis.emotionalUndercurrent}
        </p>
      </div>
      
      {/* Hidden Strength */}
      <div className="mb-4 p-3 rounded" style={{ background: 'rgba(39,174,96,0.08)' }}>
        <div className="text-xs uppercase tracking-wide mb-1 font-semibold" style={{ color: '#27ae60' }}>
          ✦ Hidden Strength
        </div>
        <p className="text-sm" style={{ color: '#7dba94', lineHeight: 1.5 }}>
          {aiAnalysis.hiddenStrength}
        </p>
      </div>
      
      {/* Primary Weakness */}
      <div className="mb-4 p-3 rounded"
        style={{ 
          background: 'rgba(231,76,60,0.06)', 
          borderLeft: '3px solid rgba(231,76,60,0.4)' 
        }}>
        <div className="text-sm font-medium mb-2" style={{ color: '#e8e6e3' }}>
          {aiAnalysis.primaryWeakness.name}
        </div>
        <p className="text-xs mb-2" style={{ color: '#928374', lineHeight: 1.5 }}>
          {aiAnalysis.primaryWeakness.observation}
        </p>
        <p className="text-xs italic mb-3" style={{ color: '#a89984', lineHeight: 1.5 }}>
          Why it matters: {aiAnalysis.primaryWeakness.whyItMatters}
        </p>
        <div className="p-2 rounded mb-2" style={{ background: 'rgba(131,165,152,0.1)' }}>
          <span className="text-xs font-semibold" style={{ color: '#8ec07c' }}>TOMORROW: </span>
          <span className="text-xs" style={{ color: '#83a598' }}>
            {aiAnalysis.primaryWeakness.tomorrowFocus}
          </span>
        </div>
        <div className="p-2 rounded" style={{ background: 'rgba(184,187,38,0.1)' }}>
          <span className="text-xs font-semibold" style={{ color: '#b8bb26' }}>5-MIN EXERCISE: </span>
          <span className="text-xs" style={{ color: '#b8bb26' }}>
            {aiAnalysis.primaryWeakness.microExercise}
          </span>
        </div>
      </div>
      
      {/* Secondary Weakness */}
      <div className="mb-4 p-3 rounded" style={{ background: 'rgba(243,156,18,0.06)' }}>
        <div className="text-sm font-medium mb-1" style={{ color: '#f39c12' }}>
          {aiAnalysis.secondaryWeakness.name}
        </div>
        <p className="text-xs mb-1" style={{ color: '#928374', lineHeight: 1.5 }}>
          {aiAnalysis.secondaryWeakness.observation}
        </p>
        <p className="text-xs" style={{ color: '#d79921' }}>
          Quick fix: {aiAnalysis.secondaryWeakness.quickFix}
        </p>
      </div>
      
      {/* Sentence Revision */}
      <div className="mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="text-xs uppercase tracking-wide mb-2" style={{ color: '#665c54' }}>
          Revision Example
        </div>
        <div className="text-xs line-through opacity-70 mb-1" style={{ color: '#928374' }}>
          "{aiAnalysis.sentenceToRevise.original}"
        </div>
        <div className="text-sm mb-1" style={{ color: '#8ec07c' }}>
          "{aiAnalysis.sentenceToRevise.revised}"
        </div>
        <div className="text-xs italic" style={{ color: '#665c54' }}>
          Principle: {aiAnalysis.sentenceToRevise.principle}
        </div>
      </div>
      
      {/* Question to Sit With */}
      <div className="p-4 rounded-lg text-center"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))' }}>
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#8b5cf6' }}>
          Question to Sit With
        </div>
        <p className="text-base italic" style={{ color: '#d5c4a1', lineHeight: 1.6 }}>
          "{aiAnalysis.questionToSitWith}"
        </p>
      </div>
      
      {/* Run Again */}
      <button
        onClick={() => { setHasAnalyzed(false); setAiAnalysis(null); }}
        className="w-full mt-4 py-2 rounded text-xs transition-all"
        style={{
          background: 'transparent',
          border: '1px solid rgba(139,92,246,0.3)',
          color: '#8b5cf6',
          cursor: 'pointer'
        }}
      >
        Run New Analysis
      </button>
    </div>
  );
}
