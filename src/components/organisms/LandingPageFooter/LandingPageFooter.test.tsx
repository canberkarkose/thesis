import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { LandingPageFooter } from './LandingPageFooter';

// Mock FooterContainer component
jest.mock('./LandingPageFooter.styles', () => ({
  FooterContainer: jest.fn(() => <div data-testid='footer-container' />),
}));

describe('LandingPageFooter Component', () => {
  test('renders FooterContainer', () => {
    render(<LandingPageFooter />);
    const footer = screen.getByTestId('footer-container');
    expect(footer).toBeInTheDocument();
  });
});
