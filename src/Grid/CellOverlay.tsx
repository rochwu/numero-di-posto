import {FC} from 'react';

import styled from '@emotion/styled';
import {useSelector} from 'react-redux';
import {Identifier, selectHighlight} from '../state';
import {Size} from '../globals';

const Highlight = styled.div({
  display: 'grid',
});

const Selection = styled.div({
  display: 'grid',
  justifyContent: 'center',
  alignItems: 'center',
});

const halfCell = `${
  parseInt(Size.Pen.substring(0, 2), 10) / 2
}${Size.Pen.substring(2)}`;

export const CellOverlay: FC<{
  isSelected: boolean;
  isFirstSelected: boolean;
  value: string;
  identifier: Identifier;
}> = ({isSelected, isFirstSelected, children, value, identifier: id}) => {
  const highlight = useSelector(selectHighlight(id));

  const selectionStyle = isSelected
    ? {
        backgroundColor: 'rgb(200, 200, 200, 0.5)',
        boxShadow: isFirstSelected ? `inset 0 0 4px black` : undefined,
      }
    : undefined;

  const highlightStyle =
    highlight && !value
      ? {
          backgroundColor: highlight,
          boxShadow: isSelected ? `inset 0 0 ${halfCell} white` : undefined,
        }
      : undefined;

  return (
    <Highlight style={highlightStyle}>
      <Selection style={selectionStyle}>{children}</Selection>
    </Highlight>
  );
};
