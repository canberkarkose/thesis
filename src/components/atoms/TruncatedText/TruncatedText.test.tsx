import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { TruncatedText } from './TruncatedText';

describe('TruncatedText', () => {
  test('renders the text correctly', () => {
    render(<TruncatedText text='Sample text' />);
    const textElement = screen.getByTestId(dataTestIds.components.truncatedText.textElement);
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('Sample text');
  });

  test('does not show tooltip when the text fits within the container', () => {
    render(
      <div style={{ width: '500px', overflow: 'hidden' }}>
        <TruncatedText text='Short text' />
      </div>
    );

    const textElement = screen.getByTestId(dataTestIds.components.truncatedText.textElement);

    // Simulate no truncation (scrollWidth <= clientWidth)
    Object.defineProperty(textElement, 'scrollWidth', { value: 100, writable: true });
    Object.defineProperty(textElement, 'clientWidth', { value: 200, writable: true });

    userEvent.hover(textElement);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
