import { LandingPageHeader } from '../../organisms/LandingPageHeader/LandingPageHeader';
import { LandingPageFooter } from '../../organisms/LandingPageFooter/LandingPageFooter';
import { LandingPageIntroSection } from '../../organisms/LandingPageIntroSection/LandingPageIntroSection';

import { Space } from '../../atoms/Space/Space';

import { LandingPageDemo } from '../../organisms/LandingPageDemo/LandingPageDemo';

import { LandingPageFeaturesSection } from '../../organisms/LandingPageFeaturesSection/LandingPageFeaturesSection';

import { MainContentContainer, DemoInvitation } from './LandingPage.styles';

export const LandingPagePresentation = () => (
  <>
    <LandingPageHeader />
    <MainContentContainer>
      <LandingPageIntroSection />
      <Space s24 />
      <Space s24 />
      <DemoInvitation variant='h5' color='action.active'>
        Not quite ready to sign up? Try our quick demo and see what&apos;s cooking!
      </DemoInvitation>
      <Space s24 />
      <LandingPageDemo />
      <Space s24 />
      <Space s24 />
      <LandingPageFeaturesSection />
      <Space s32 />
      <Space s32 />
    </MainContentContainer>
    <LandingPageFooter />
  </>
);
