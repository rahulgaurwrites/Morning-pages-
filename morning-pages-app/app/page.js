'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import WritingPage from '@/components/WritingPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  if (currentPage === 'landing') {
    return <LandingPage onStart={() => setCurrentPage('writing')} />;
  }
  
  return <WritingPage onBack={() => setCurrentPage('landing')} />;
}
