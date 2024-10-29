import { useState } from 'react';

import { LandingPageDemoPresentation } from './LandingPageDemoPresentation';
import { ManualDemo } from './DemoTypes/ManualDemo';
import { QuizDemo } from './DemoTypes/QuizDemo';

export const LandingPageDemo = () => {
  const [currentDemoStep, setCurrentDemoStep] = useState<'start' | 'manual' | 'quiz'>('start');

  const handleDemoOptionSelect = (option: 'manual' | 'quiz') => {
    setCurrentDemoStep(option);
  };

  const handleBackToStart = () => {
    setCurrentDemoStep('start');
  };

  return (
    <>
      {currentDemoStep === 'start' && (
        <LandingPageDemoPresentation onSelectDemo={handleDemoOptionSelect} />
      )}
      {currentDemoStep === 'manual' && (
        <ManualDemo onBack={handleBackToStart} />
      )}
      {currentDemoStep === 'quiz' && (
        <QuizDemo onBack={handleBackToStart} />
      )}
    </>
  );
};
