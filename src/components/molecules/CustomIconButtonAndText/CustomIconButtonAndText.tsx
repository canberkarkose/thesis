// CustomIconButtonAndText.tsx

import React from 'react';
import { IconButton, Typography, Tooltip } from '@mui/material';

import { CustomContainer, CustomBox } from './CustomIconButtonAndText.styles';

interface CustomIconButtonAndTextProps {
  icon: React.ReactElement;
  text: string;
  onIconClick: () => void;
  tooltip?: string;
}

export const CustomIconButtonAndText = ({
  icon,
  text,
  onIconClick,
  tooltip,
}: CustomIconButtonAndTextProps) => (
  <CustomContainer>
    <CustomBox>
      {tooltip ? (
        <Tooltip title={tooltip}>
          <IconButton onClick={onIconClick} sx={{ right: 10 }}>
            {icon}
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton onClick={onIconClick} sx={{ right: 10 }}>
          {icon}
        </IconButton>
      )}
      <Typography
        variant='h4'
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {text}
      </Typography>
    </CustomBox>
  </CustomContainer>
);
