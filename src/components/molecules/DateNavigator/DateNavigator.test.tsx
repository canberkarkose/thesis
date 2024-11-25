/* eslint-disable react/jsx-props-no-spreading */

import { render, screen, fireEvent } from '@testing-library/react';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { DateNavigator } from './DateNavigator';

describe('DateNavigator Component', () => {
  const mockChangeDate = jest.fn();
  const mockSetEditMode = jest.fn();
  const mockFormatDisplayDate = jest.fn();

  const defaultProps = {
    isViewDaily: true,
    currentDate: new Date(2023, 9, 15),
    minDailyDate: new Date(2023, 9, 10),
    minWeeklyDate: new Date(2023, 9, 10),
    maxDailyDate: new Date(2023, 9, 20),
    maxWeeklyDate: new Date(2023, 9, 20),
    formatDisplayDate: mockFormatDisplayDate,
    changeDate: mockChangeDate,
    showEditButton: true,
    editMode: false,
    setEditMode: mockSetEditMode,
    recipeToAdd: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDisplayDate.mockReturnValue('October 15, 2023');
  });

  it('should render correctly with required props', () => {
    render(<DateNavigator {...defaultProps} />);

    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.previousButton)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.nextButton)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.dateDisplay)
    ).toHaveTextContent('October 15, 2023');
    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.editButton)
    ).toBeInTheDocument();
  });

  it('should call changeDate with "back" when previous button is clicked', () => {
    render(<DateNavigator {...defaultProps} />);

    const previousButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.previousButton
    );

    fireEvent.click(previousButton);

    expect(mockChangeDate).toHaveBeenCalledWith('back');
  });

  it('should call changeDate with "forward" when next button is clicked', () => {
    render(<DateNavigator {...defaultProps} />);

    const nextButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.nextButton
    );

    fireEvent.click(nextButton);

    expect(mockChangeDate).toHaveBeenCalledWith('forward');
  });

  it('should disable previous button when at min date', () => {
    const props = {
      ...defaultProps,
      currentDate: new Date(2023, 9, 10),
    };

    render(<DateNavigator {...props} />);

    const previousButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.previousButton
    );

    expect(previousButton).toBeDisabled();
  });

  it('should disable next button when at max date', () => {
    const props = {
      ...defaultProps,
      currentDate: new Date(2023, 9, 20),
    };

    render(<DateNavigator {...props} />);

    const nextButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.nextButton
    );

    expect(nextButton).toBeDisabled();
  });

  it('should display "Previous Day" and "Next Day" when isViewDaily is true', () => {
    render(<DateNavigator {...defaultProps} />);

    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.previousButton)
    ).toHaveTextContent('Previous Day');
    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.nextButton)
    ).toHaveTextContent('Next Day');
  });

  it('should display "Previous Week" and "Next Week" when isViewDaily is false', () => {
    const props = {
      ...defaultProps,
      isViewDaily: false,
    };

    render(<DateNavigator {...props} />);

    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.previousButton)
    ).toHaveTextContent('Previous Week');
    expect(
      screen.getByTestId(dataTestIds.components.dateNavigator.nextButton)
    ).toHaveTextContent('Next Week');
  });

  it('should toggle edit mode when edit button is clicked', () => {
    render(<DateNavigator {...defaultProps} />);

    const editButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.editButton
    );

    fireEvent.click(editButton);

    expect(mockSetEditMode).toHaveBeenCalledWith(true);
  });

  it('should display CancelIcon and tooltip when editMode is true', () => {
    const props = {
      ...defaultProps,
      editMode: true,
    };

    render(<DateNavigator {...props} />);

    const editButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.editButton
    );

    expect(editButton.querySelector('svg[data-testid="CancelIcon"]')).toBeInTheDocument();

    fireEvent.mouseOver(editButton);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Cancel');
  });

  it('should display EditIcon and tooltip when editMode is false', () => {
    render(<DateNavigator {...defaultProps} />);

    const editButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.editButton
    );

    expect(editButton.querySelector('svg[data-testid="EditIcon"]')).toBeInTheDocument();

    fireEvent.mouseOver(editButton);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Edit');
  });

  it('should hide edit button when showEditButton is false', () => {
    const props = {
      ...defaultProps,
      showEditButton: false,
    };

    render(<DateNavigator {...props} />);

    const editButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.editButton
    );

    expect(editButton).toHaveStyle('visibility: hidden');
  });

  it('should disable edit button when recipeToAdd is not null', () => {
    const props = {
      ...defaultProps,
      recipeToAdd: { id: 1, title: 'Recipe' },
    };

    render(<DateNavigator {...props} />);

    const editButton = screen.getByTestId(
      dataTestIds.components.dateNavigator.editButton
    );

    expect(editButton).toBeDisabled();
  });
});
