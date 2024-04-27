import { dataTestIds } from '../../../dataTest/dataTestIds';

import { SpaceContainer } from './Space.styles';

const sizes = {
  s8: '8px',
  s12: '12px',
  s16: '16px',
  s24: '24px',
  s32: '32px',
};

type SpaceProps = {
  horizontal?: boolean;
  s12?: boolean;
  s16?: boolean;
  s24?: boolean;
  s32?: boolean;
};

export const Space = (props: SpaceProps) => {
  const {
    s12, s16, s24, s32, horizontal
  } = props;

  let size = sizes.s8;
  if (s12) size = sizes.s12;
  else if (s16) size = sizes.s16;
  else if (s24) size = sizes.s24;
  else if (s32) size = sizes.s32;

  return (
    <SpaceContainer
      data-testid={dataTestIds.components.spaceContainer}
      horizontal={horizontal}
      size={size}
    />
  );
};
