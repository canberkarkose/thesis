/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, act } from '@testing-library/react';

import { usePrevious } from './usePrevious';

// Test Component to utilize the usePrevious hook
const TestComponent: React.FC<{ value: any }> = ({ value }) => {
  const previous = usePrevious(value);
  return (
    <div>
      <div data-testid='current'>{value}</div>
      <div data-testid='previous'>{previous !== undefined ? previous.toString() : 'undefined'}</div>
    </div>
  );
};

describe('usePrevious Hook', () => {
  it('should return undefined on initial render', () => {
    render(<TestComponent value={1} />);

    expect(screen.getByTestId('current')).toHaveTextContent('1');
    expect(screen.getByTestId('previous')).toHaveTextContent('undefined');
  });

  it('should return the previous value after an update', () => {
    const { rerender } = render(<TestComponent value={1} />);

    // Initial render assertions
    expect(screen.getByTestId('current')).toHaveTextContent('1');
    expect(screen.getByTestId('previous')).toHaveTextContent('undefined');

    // Update the value to 2
    act(() => {
      rerender(<TestComponent value={2} />);
    });

    expect(screen.getByTestId('current')).toHaveTextContent('2');
    expect(screen.getByTestId('previous')).toHaveTextContent('1');
  });

  it('should always return the immediate previous value after multiple updates', () => {
    const { rerender } = render(<TestComponent value={1} />);

    // Initial render
    expect(screen.getByTestId('current')).toHaveTextContent('1');
    expect(screen.getByTestId('previous')).toHaveTextContent('undefined');

    // First update to 2
    act(() => {
      rerender(<TestComponent value={2} />);
    });

    expect(screen.getByTestId('current')).toHaveTextContent('2');
    expect(screen.getByTestId('previous')).toHaveTextContent('1');

    // Second update to 3
    act(() => {
      rerender(<TestComponent value={3} />);
    });

    expect(screen.getByTestId('current')).toHaveTextContent('3');
    expect(screen.getByTestId('previous')).toHaveTextContent('2');

    // Third update to 4
    act(() => {
      rerender(<TestComponent value={4} />);
    });

    expect(screen.getByTestId('current')).toHaveTextContent('4');
    expect(screen.getByTestId('previous')).toHaveTextContent('3');
  });
});
