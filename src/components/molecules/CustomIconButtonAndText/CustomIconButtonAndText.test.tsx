import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { CustomIconButtonAndText } from './CustomIconButtonAndText';

describe('CustomIconButtonAndText component', () => {
  const mockOnClick = jest.fn();
  const icon = <span>Icon</span>;

  it('renders the icon and text correctly', () => {
    const { getByTestId } = render(
      <CustomIconButtonAndText
        icon={icon}
        text='Sample Text'
        onIconClick={mockOnClick}
      />
    );

    expect(getByTestId(
      dataTestIds.components.customIconButtonAndText.iconButton
    )).toBeInTheDocument();
    expect(getByTestId(dataTestIds.components.customIconButtonAndText.text)).toHaveTextContent('Sample Text');
  });

  it('calls onIconClick when the icon button is clicked', () => {
    const { getByTestId } = render(
      <CustomIconButtonAndText
        icon={icon}
        text='Sample Text'
        onIconClick={mockOnClick}
      />
    );

    fireEvent.click(getByTestId(dataTestIds.components.customIconButtonAndText.iconButton));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays tooltip text when provided', () => {
    const tooltipText = 'Sample Text';
    const { getByText, getByTestId } = render(
      <CustomIconButtonAndText
        icon={icon}
        text='Sample Text'
        onIconClick={mockOnClick}
        tooltip={tooltipText}
      />
    );

    fireEvent.mouseOver(getByTestId(dataTestIds.components.customIconButtonAndText.iconButton));
    expect(getByText(tooltipText)).toBeInTheDocument();
  });

  it('does not display tooltip when tooltip prop is not provided', () => {
    const { queryByRole, getByTestId } = render(
      <CustomIconButtonAndText
        icon={icon}
        text='Sample Text'
        onIconClick={mockOnClick}
      />
    );

    fireEvent.mouseOver(getByTestId(dataTestIds.components.customIconButtonAndText.iconButton));
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
