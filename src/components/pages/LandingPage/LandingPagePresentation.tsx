import { LandingPageHeader } from '../../organisms/LandingPageHeader/LandingPageHeader';
import { LandingPageFooter } from '../../organisms/LandingPageFooter/LandingPageFooter';
import { LandingPageIntroSection } from '../../organisms/LandingPageIntroSection/LandingPageIntroSection';

import { Space } from '../../atoms/Space/Space';

import { LandingPageDemo } from '../../organisms/LandingPageDemo/LandingPageDemo';

import { LandingPageFeaturesSection } from '../../organisms/LandingPageFeaturesSection/LandingPageFeaturesSection';

import { MainContentContainer, GlobalBackground } from './LandingPage.styles';

export const LandingPagePresentation = () => (
  <>
    <LandingPageHeader />
    <GlobalBackground coverBackground>
      <MainContentContainer>
        <LandingPageIntroSection />
        <Space s24 />
        <Space s24 />
        <LandingPageDemo />
        <Space s24 />
        <Space s24 />
        <LandingPageFeaturesSection />
        <Space s32 />
        <Space s32 />
      </MainContentContainer>
    </GlobalBackground>
    <LandingPageFooter />
  </>
);
