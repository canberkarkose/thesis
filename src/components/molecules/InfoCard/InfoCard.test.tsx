import { render } from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { InfoCard } from './InfoCard';

describe('InfoCard component', () => {
  const mockTitle = 'Test Title';
  const mockText = 'Test Text';
  const mockIcon = <span>Mock Icon</span>;

  it('renders the InfoCard with title, text, and icon correctly', () => {
    const { getByTestId } = render(
      <InfoCard icon={mockIcon} title={mockTitle} text={mockText} />
    );

    const container = getByTestId(dataTestIds.components.infoCard.container);
    const icon = getByTestId(dataTestIds.components.infoCard.icon);
    const title = getByTestId(dataTestIds.components.infoCard.title);
    const text = getByTestId(dataTestIds.components.infoCard.text);

    expect(container).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toContainHTML('<span>Mock Icon</span>'); // Confirms icon is rendered
    expect(title).toHaveTextContent(mockTitle);
    expect(text).toHaveTextContent(mockText);
  });
});
