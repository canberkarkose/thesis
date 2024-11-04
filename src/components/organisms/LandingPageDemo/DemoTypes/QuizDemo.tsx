/* eslint-disable max-len */
import {
  Box, Button, Paper, Typography
} from '@mui/material';

import { useState, useEffect } from 'react';

import { DemoContentWrapper } from '../templates/DemoContentWrapper';
import {
  createCuisineQuestions,
  createDietQuestions,
  createIntoleranceQuestions,
  createMaxReadyTimeQuestion
} from '../constants';

import { Space } from '@components/atoms/Space/Space';

interface QuizDemoProps {
  onBack: () => void;
  onGenerateMeals: (
    diet: string,
    intolerances: string[],
    cuisines: string[],
    excludeCuisines: string[],
    maxReadyTime?: number
  ) => void;
}

export const QuizDemo = ({ onBack, onGenerateMeals }: QuizDemoProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [diet, setDiet] = useState<string | undefined>();
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [excludeCuisines, setExcludeCuisines] = useState<string[]>([]);
  const [maxReadyTime, setMaxReadyTime] = useState<number | undefined>();
  const [questions, setQuestions] = useState<{
    text: string;
    onYes:() => void,
    onNo?: () => void
      }[]>([]);

  useEffect(() => {
    // Create questions with access to setter functions
    const dietQuestions = createDietQuestions(setDiet);
    const intoleranceQuestions = createIntoleranceQuestions(setIntolerances);
    const cuisineQuestions = createCuisineQuestions(setCuisines, setExcludeCuisines);
    const maxReadyTimeQuestion = createMaxReadyTimeQuestion(setMaxReadyTime);

    const randomizedQuestions: { text: string; onYes: () => void; onNo?: () => void }[] = [];

    const randomDietQuestion = dietQuestions[Math.floor(Math.random() * dietQuestions.length)];
    const randomIntoleranceQuestion = intoleranceQuestions[Math.floor(Math.random() * intoleranceQuestions.length)];
    const randomCuisineQuestion = cuisineQuestions[Math.floor(Math.random() * cuisineQuestions.length)];

    const categories = [randomDietQuestion, randomIntoleranceQuestion, randomCuisineQuestion];
    categories.sort(() => Math.random() - 0.5);

    randomizedQuestions.push(...categories, maxReadyTimeQuestion);
    setQuestions(randomizedQuestions);
  }, [setDiet, setIntolerances, setCuisines, setExcludeCuisines, setMaxReadyTime]);

  const handleAnswer = (isYes: boolean) => {
    if (isYes) {
      questions[currentQuestionIndex].onYes();
    } else {
      questions[currentQuestionIndex].onNo?.();
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onGenerateMeals(
        diet || 'anything',
        intolerances,
        cuisines,
        excludeCuisines,
        maxReadyTime
      );
    }
  };

  return (
    <DemoContentWrapper
      isQuiz
      headline='Take the Meal Quiz'
      subheading='Answer a few questions to generate personalized meals'
      shouldDisplayGoBackButton
      onBack={onBack}
    >
      <Space s32 />
      <Space s32 />
      <Paper
        elevation={3}
        style={{
          minWidth: '400px',
          maxWidth: '600px',
          padding: '20px',
          backgroundColor: '#f4f4f4',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}
      >
        <Typography variant='h6' gutterBottom style={{ fontWeight: 'bold' }}>
          {questions[currentQuestionIndex]?.text}
        </Typography>
        <Box display='flex' justifyContent='center' gap={2} marginTop='20px'>
          <Button variant='contained' color='primary' onClick={() => handleAnswer(true)}>
            Yes
          </Button>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#D67333',
              '&:hover': {
                backgroundColor: '#84441b'
              }
            }}
            onClick={() => handleAnswer(false)}
          >
            No
          </Button>
        </Box>
      </Paper>
    </DemoContentWrapper>
  );
};
