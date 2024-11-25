import { render } from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { Space } from './Space';

describe('Space component', () => {
  it('renders with default size of 8px when no size props are passed', () => {
    const { getByTestId } = render(<Space />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 8px');
    expect(spaceElement).toHaveStyle('width: 1px');
  });

  it('renders with size of 12px when s12 prop is true', () => {
    const { getByTestId } = render(<Space s12 />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 12px');
    expect(spaceElement).toHaveStyle('width: 1px');
  });

  it('renders with size of 16px when s16 prop is true', () => {
    const { getByTestId } = render(<Space s16 />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 16px');
    expect(spaceElement).toHaveStyle('width: 1px');
  });

  it('renders with size of 24px when s24 prop is true', () => {
    const { getByTestId } = render(<Space s24 />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 24px');
    expect(spaceElement).toHaveStyle('width: 1px');
  });

  it('renders with size of 32px when s32 prop is true', () => {
    const { getByTestId } = render(<Space s32 />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 32px');
    expect(spaceElement).toHaveStyle('width: 1px');
  });

  it('renders horizontally with the correct size when horizontal prop is true', () => {
    const { getByTestId } = render(<Space horizontal s16 />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 1px');
    expect(spaceElement).toHaveStyle('width: 16px');
  });

  it('renders horizontally with default size of 8px when no specific size props are passed', () => {
    const { getByTestId } = render(<Space horizontal />);
    const spaceElement = getByTestId(dataTestIds.components.spaceContainer);
    expect(spaceElement).toHaveStyle('height: 1px');
    expect(spaceElement).toHaveStyle('width: 8px');
  });
});
