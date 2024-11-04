import { Box, Typography, Button } from '@mui/material';

import { MainContentContainer, GlobalBackground } from '../LandingPage/LandingPage.styles';

import { LandingPageFooter } from '../../organisms/LandingPageFooter/LandingPageFooter';
import { LandingPageHeader } from '../../organisms/LandingPageHeader/LandingPageHeader';

import signupImage from '../../../assets/signup_image.png';
import dashboardIimage from '../../../assets/dashboard_image.png';
import mealGeneratorImage from '../../../assets/meal_generator_image.png';
import groceryListImage from '../../../assets/grocery_list_image.png';
import recipesImage from '../../../assets/recipes_image.png';

import { Step } from './Step';

export const HowItWorks: React.FC = () => (
  <>
    <LandingPageHeader />
    <GlobalBackground coverBackground>
      <MainContentContainer>
        {/* Title */}
        <Box
          textAlign='center'
          padding='16px'
        >
          <Typography variant='h3' fontWeight='bold' color='primary.dark' gutterBottom>
            Discover How Bite by Byte Makes Your Meal Planning Effortless!
          </Typography>
        </Box>

        {/* Steps */}
        <Step
          imageSrc={signupImage}
          title='Step 1: Sign Up and Set Your Preferences'
          description="Create an account and set your dietary preferences, intolerances, and favorite cuisines. This information ensures we tailor the best meals for you. Don&apos;t worry, you can always change these settings later!"
          reverse={false}
        />
        <Step
          imageSrc={dashboardIimage}
          title='Step 2: Access Your Dashboard'
          description="Once your details are filled, you'll be directed to your personalized dashboard. Here, you&apos;ll find all your generated meals, grocery lists, and saved recipes. Your dashboard will evolve as you interact with the app!"
          reverse
        />
        <Step
          imageSrc={mealGeneratorImage}
          title='Step 3: Generate Your Daily Meals'
          description='Head to the Meal Generator page to create delicious daily meals. You&apos;ll have the option to customize further, using both your preferences set during sign-up and additional prompts.'
          reverse={false}
        />
        <Step
          imageSrc={groceryListImage}
          title='Step 4: Organize Your Grocery List'
          description='Based on your generated meals, our Grocery List Generator will categorize your ingredients to make your shopping experience a breeze. Everything you need is just a click away!'
          reverse
        />
        <Step
          imageSrc={recipesImage}
          title='Step 5: Explore New Recipes'
          description='Check out the Recipes page for a continuous feed of new meal ideas. You can load more recipes as needed and never run out of inspiration for your next meal!'
          reverse={false}
        />

        {/* CTA Buttons */}
        <Box textAlign='center' marginTop='20px' marginBottom='20px'>
          <Button variant='contained' color='primary' size='large' style={{ marginRight: '16px' }}>
            Sign Up Now!
          </Button>
        </Box>
      </MainContentContainer>
    </GlobalBackground>
    <LandingPageFooter />
  </>
);
