import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { DemoContainer, Headline, Subheading } from './DemoContentWrapper.styles';

interface DemoContentWrapperProps {
  isOpeningScreen?: boolean;
  isQuiz?: boolean;
  headline: string;
  subheading: string;
  children: React.ReactNode;
  shouldDisplayGoBackButton?: boolean;
  onBack?: () => void;
}

export const DemoContentWrapper = ({
  isOpeningScreen,
  isQuiz,
  headline,
  subheading,
  children,
  shouldDisplayGoBackButton,
  onBack,
}: DemoContentWrapperProps) => (
  <DemoContainer isOpeningScreen={isOpeningScreen} isQuiz={isQuiz}>
    <Box display='flex' alignItems='center' sx={{ left: shouldDisplayGoBackButton ? -10 : undefined }}>
      {shouldDisplayGoBackButton && (
        <IconButton onClick={onBack} sx={{ right: 5, marginBottom: '16px' }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Headline variant='h4'>{headline}</Headline>
    </Box>
    <Subheading variant='subtitle1'>{subheading}</Subheading>
    {children}
  </DemoContainer>
);
