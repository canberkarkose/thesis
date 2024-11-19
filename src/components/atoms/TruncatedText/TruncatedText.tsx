import React, { useRef, useState, useEffect } from 'react';
import { Tooltip, Typography } from '@mui/material';

interface TruncatedTextProps {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variant?: any;
  style?: React.CSSProperties;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, variant = 'body1', style }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const { current } = textRef;
    if (current) {
      setIsTruncated(current.scrollWidth > current.clientWidth);
    }
  }, [text]);

  return (
    <Tooltip title={isTruncated ? text : ''}>
      <Typography
        ref={textRef}
        variant={variant}
        noWrap
        style={{ ...style }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default TruncatedText;
