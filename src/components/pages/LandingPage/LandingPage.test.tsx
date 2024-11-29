import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { LandingPage } from './LandingPage';
import { LandingPagePresentation } from './LandingPagePresentation';

// Mocking Subcomponents
jest.mock('../../organisms/LandingPageHeader/LandingPageHeader', () => ({
  LandingPageHeader: () => <div data-testid='landing-page-header'>LandingPageHeader</div>,
}));

jest.mock('../../organisms/LandingPageFooter/LandingPageFooter', () => ({
  LandingPageFooter: () => <div data-testid='landing-page-footer'>LandingPageFooter</div>,
}));

jest.mock('../../organisms/LandingPageIntroSection/LandingPageIntroSection', () => ({
  LandingPageIntroSection: () => (
    <div data-testid='landing-page-intro-section'>LandingPageIntroSection</div>
  ),
}));

jest.mock('../../atoms/Space/Space', () => ({
  Space: () => (
    <div data-testid='space-container'>
      Space
    </div>
  ),
}));

jest.mock('../../organisms/LandingPageDemo/LandingPageDemo', () => ({
  LandingPageDemo: () => <div data-testid='landing-page-demo'>LandingPageDemo</div>,
}));

jest.mock('../../organisms/LandingPageFeaturesSection/LandingPageFeaturesSection', () => ({
  LandingPageFeaturesSection: () => (
    <div data-testid='landing-page-features-section'>LandingPageFeaturesSection</div>
  ),
}));

jest.mock('./LandingPage.styles', () => ({
  MainContentContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='main-content-container'>{children}</div>
  ),
  GlobalBackground: ({
    coverBackground,
    children,
  }: {
    coverBackground: boolean;
    children: React.ReactNode;
  }) => (
    <div data-testid='global-background' style={{ background: coverBackground ? 'cover' : 'none' }}>
      {children}
    </div>
  ),
}));

describe('LandingPage Component', () => {
  it('renders LandingPagePresentation within LandingPage', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Verify that LandingPagePresentation is rendered
    expect(screen.getByTestId('landing-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-intro-section')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-demo')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-features-section')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-footer')).toBeInTheDocument();

    // Verify Space components
    const spaceElements = screen.getAllByTestId('space-container');
    expect(spaceElements.length).toBe(6);

    // Verify styled components
    expect(screen.getByTestId('global-background')).toBeInTheDocument();
    expect(screen.getByTestId('main-content-container')).toBeInTheDocument();
  });

  it('renders LandingPagePresentation separately', () => {
    render(
      <MemoryRouter>
        <LandingPagePresentation />
      </MemoryRouter>
    );

    // Verify that LandingPagePresentation is rendered
    expect(screen.getByTestId('landing-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-intro-section')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-demo')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-features-section')).toBeInTheDocument();
    expect(screen.getByTestId('landing-page-footer')).toBeInTheDocument();

    // Verify Space components
    const spaceElements = screen.getAllByTestId('space-container');
    expect(spaceElements.length).toBe(6);

    // Verify styled components
    expect(screen.getByTestId('global-background')).toBeInTheDocument();
    expect(screen.getByTestId('main-content-container')).toBeInTheDocument();
  });

  it('applies the coverBackground prop correctly in GlobalBackground', () => {
    render(
      <MemoryRouter>
        <LandingPagePresentation />
      </MemoryRouter>
    );

    const globalBackground = screen.getByTestId('global-background');
    expect(globalBackground).toHaveStyle('background: cover');
  });
});
