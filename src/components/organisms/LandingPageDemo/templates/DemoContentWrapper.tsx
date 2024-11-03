import { DemoContainer, Headline, Subheading } from './DemoContentWrapper.styles';

interface DemoContentWrapperProps {
  headline: string;
  subheading: string;
  children: React.ReactNode;
}

export const DemoContentWrapper = ({
  headline,
  subheading,
  children,
}: DemoContentWrapperProps) => (
  <DemoContainer>
    <Headline variant='h4'>{headline}</Headline>
    <Subheading variant='subtitle1'>{subheading}</Subheading>
    {children}
  </DemoContainer>
);
