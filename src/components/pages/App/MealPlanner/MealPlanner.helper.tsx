import { Button, Typography } from '@mui/material';

interface renderPaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const renderPaginationButtons = (
  { currentPage, totalPages, onPageChange }: renderPaginationButtonsProps
) => {
  const buttons = [];
  buttons.push(
    <Button
      key={1}
      variant='outlined'
      onClick={() => onPageChange(1)}
      disabled={currentPage === 1}
    >
      1
    </Button>
  );
  if (currentPage > 3) {
    buttons.push(
      <Typography key='dots-start' variant='body1'>
        ...
      </Typography>
    );
  }
  if (currentPage > 2) {
    buttons.push(
      <Button
        key={currentPage - 1}
        variant='outlined'
        onClick={() => onPageChange(currentPage - 1)}
      >
        {currentPage - 1}
      </Button>
    );
  }
  if (currentPage !== 1) {
    buttons.push(
      <Button key={currentPage} variant='outlined' disabled>
        {currentPage}
      </Button>
    );
  }
  if (currentPage < totalPages - 1) {
    buttons.push(
      <Button
        key={currentPage + 1}
        variant='outlined'
        onClick={() => onPageChange(currentPage + 1)}
      >
        {currentPage + 1}
      </Button>
    );
  }
  if (currentPage < totalPages - 2) {
    buttons.push(
      <Typography key='dots-end' variant='body1'>
        ...
      </Typography>
    );
  }
  if (currentPage !== totalPages && totalPages > 1) {
    buttons.push(
      <Button
        key={totalPages}
        variant='outlined'
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Button>
    );
  }
  return buttons;
};
