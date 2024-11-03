import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import QuizIcon from '@mui/icons-material/Quiz';

import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

import { DemoContentWrapper } from './templates/DemoContentWrapper';

import { ButtonsContainer } from './LandingPageDemo.styles';

import orange from '@src/assets/orange.svg?url';
import eggplant from '@src/assets/eggplant.svg?url';
import pear from '@src/assets/pear.svg?url';
import apple from '@src/assets/apple.svg?url';
import lemon from '@src/assets/lemon.svg?url';

interface LandingPageDemoPresentationProps {
  onSelectDemo: (option: 'manual' | 'quiz') => void;
}

export const LandingPageDemoPresentation = ({ onSelectDemo }: LandingPageDemoPresentationProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      // Load slim version to reduce bundle size
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = {
    fullScreen: {
      enable: false,
    },
    particles: {
      number: {
        value: 20,
        density: {
          enable: false,
          height: 800,
          width: 800,
        },
      },
      shape: {
        type: 'image',
        options: {
          image: [
            {
              src: orange,
              width: 100,
              height: 100,
            },
            {
              src: eggplant,
              width: 100,
              height: 100,
            },
            {
              src: pear,
              width: 100,
              height: 100,
            },
            {
              src: apple,
              width: 100,
              height: 100,
            },
            {
              src: lemon,
              width: 100,
              height: 100,
            },
          ],
        },
      },
      size: {
        value: { min: 35, max: 35 },
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'bounce',
        },
      },
      collisions: {
        enable: true,
        mode: 'bounce',
      },
      rotate: {
        value: 0,
        random: true,
        animation: {
          enable: true,
          speed: 5,
          sync: false,
        },
        direction: 'random',
      },
      opacity: {
        value: 0.5,
      },
    },
    detectRetina: true,
  };

  return (
    <DemoContentWrapper
      isOpeningScreen
      headline='Not Quite Ready To Sign Up?'
      subheading="Try one of our quick demos and get a taste of what's cooking!"
    >
      {init && <Particles className='particles' id='tsparticles' options={particlesOptions} />}
      <ButtonsContainer>
        <Button
          variant='contained'
          color='primary'
          size='large'
          startIcon={<MenuIcon />}
          onClick={() => onSelectDemo('manual')}
        >
          Create Your Meals
        </Button>
        <Button
          variant='contained'
          size='large'
          startIcon={<QuizIcon />}
          onClick={() => onSelectDemo('quiz')}
          sx={{
            backgroundColor: '#D67333',
            '&:hover': {
              backgroundColor: '#84441b'
            }
          }}
        >
          Take the Meal Quiz
        </Button>
      </ButtonsContainer>
    </DemoContentWrapper>
  );
};
