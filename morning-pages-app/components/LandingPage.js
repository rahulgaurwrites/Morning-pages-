'use client';

import { useEffect, useState } from 'react';
import { getStreakData, calculateCurrentStreak, getLast30Days } from '@/lib/streak';

export default function LandingPage({ onStart }) {
  const [streakData, setStreakData] = useState({ totalDays: 0, longestStreak: 0, totalWords: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [last30Days, setLast30Days] = useState([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setStreakData(getStreakData());
    setCurrentStreak(calculateCurrentStreak());
    setLast30Days(getLast30Days());
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0b' }}>
        <div className="text-2xl" style={{ color: '#504945' }}>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{ background: '#0a0a0b', color: '#e8e6e3' }}>
      
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.03) 0%, transparent 50%)',
        }} />
      
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      
      {/* Content */}
      <div className="max-w-xl text-center z-10">
        <h1 className="text-6xl font-light tracking-tight leading-tight">
          Morning
          <br />
          <span style={{ color: '#a89984' }}>Pages</span>
        </h1>
        
        <p className="text-lg mt-6 italic" style={{ color: '#665c54', lineHeight: 1.7 }}>
          750 words. Every day. Before the world gets in.
        </p>
        
        {/* Streak display */}
        {currentStreak > 0 && (
          <div className="mt-10 inline-block px-6 py-5 rounded-lg"
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.06)' 
            }}>
            <div className="text-5xl font-light font-mono" style={{ color: '#d79921' }}>
              {currentStreak}
            </div>
            <div className="text-xs uppercase tracking-widest mt-1" style={{ color: '#665c54' }}>
              day streak
            </div>
          </div>
        )}
        
        {/* 30 day calendar */}
        <div className="mt-8">
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#504945' }}>
            Last 30 Days
          </div>
          <div className="flex gap-1 justify-center flex-wrap max-w-sm mx-auto">
            {last30Days.map((day, i) => (
              <div
                key={i}
                title={day.date.toLocaleDateString()}
                className="w-4 h-4 rounded"
                style={{
                  background: day.completed 
                    ? 'linear-gradient(135deg, #27ae60, #2ecc71)' 
                    : day.isToday 
                      ? 'rgba(215,153,33,0.3)'
                      : 'rgba(255,255,255,0.05)',
                  border: day.isToday ? '2px solid #d79921' : 'none',
                  boxShadow: day.completed ? '0 0 8px rgba(39,174,96,0.3)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Stats */}
        {streakData.totalDays > 0 && (
          <div className="flex justify-center gap-10 mt-6">
            <div>
              <div className="text-xl font-mono" style={{ color: '#a89984' }}>
                {streakData.longestStreak}
              </div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#504945' }}>
                longest streak
              </div>
            </div>
            <div>
              <div className="text-xl font-mono" style={{ color: '#a89984' }}>
                {streakData.totalDays}
              </div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#504945' }}>
                total days
              </div>
            </div>
            <div>
              <div className="text-xl font-mono" style={{ color: '#a89984' }}>
                {Math.round(streakData.totalWords / 1000)}k
              </div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#504945' }}>
                words written
              </div>
            </div>
          </div>
        )}
        
        {/* Start button */}
        <button
          onClick={onStart}
          className="mt-10 px-10 py-4 text-base font-semibold rounded tracking-wide transition-all hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #d79921, #b8860b)',
            color: '#0a0a0b',
            boxShadow: '0 4px 20px rgba(215,153,33,0.3)',
          }}
        >
          Begin Today's Pages
        </button>
        
        {/* AI badge */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span>🤖</span>
          <span className="text-sm" style={{ color: '#8b5cf6' }}>
            Powered by Claude AI Analysis
          </span>
        </div>
        
        {/* Quote */}
        <p className="mt-12 text-sm italic max-w-sm mx-auto" 
          style={{ color: '#3c3836', lineHeight: 1.8 }}>
          "The pages are not about writing well. They are about writing truly."
        </p>
      </div>
    </div>
  );
}
