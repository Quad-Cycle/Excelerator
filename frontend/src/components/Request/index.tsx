import React, { HTMLAttributes } from 'react';
import { styled } from 'styled-components';
import { ReactComponent as ArrowUp } from '../../assets/icons/arrow-up.svg';
import { ReactComponent as ArrowDown } from '../../assets/icons/arrow-down.svg';
import Badge from '../Badge';
import Button from '../Button';
import RequestInput from './RequestInput';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  item: RequestType;
  index: number;
  lastIndex: number;
  handlePrevRequest?: () => void;
  handleNextRequest?: () => void;
  selectedRange?: string;
  onSubmit?: () => void;
}

function Request({
  index,
  item,
  lastIndex,
  selectedRange,
  handleNextRequest,
  handlePrevRequest,
  onSubmit,
  ...rest
}: Props) {
  return (
    <RequestContainer {...rest}>
      <RequestBlock>
        <QuestionBlock>
          <span>
            {`${index + 1}. `}
            {item.request}
          </span>
          <Badge theme={themeByType[item.type]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        </QuestionBlock>
        <InputField>
          <span>사용자 지정 범위: </span>
          <RequestInput type={item.type} selectedRange={selectedRange} />
        </InputField>
      </RequestBlock>
      {index === lastIndex && (
        <Button
          text={'Submit'}
          icon={'send'}
          color={'primary'}
          style={{ marginRight: '1.5rem', alignSelf: 'flex-end' }}
          onClick={onSubmit}
        />
      )}
      <ArrowButtons>
        <ArrowButton disabled={index === 0} onClick={handlePrevRequest}>
          <ArrowUp />
        </ArrowButton>
        <ArrowButton disabled={index === lastIndex} onClick={handleNextRequest}>
          <ArrowDown />
        </ArrowButton>
      </ArrowButtons>
    </RequestContainer>
  );
}

export default Request;

const themeByType: Record<string, ColorType> = {
  database: 'cyan',
  field: 'geekblue',
  criteria: 'gold',
  result: 'magenta',
};

const RequestContainer = styled.div`
  border-radius: 1.25rem;
  background: var(--White, #fff);
  box-shadow: var(--dropdown);
  padding: 2rem;
  display: flex;
  font-size: var(--large);
  font-weight: var(--text);
  align-items: center;
  justify-content: center;
`;

const RequestBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const QuestionBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  div {
    width: fit-content;
  }
`;

const InputField = styled.div`
  margin-left: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ArrowButtons = styled.div`
  flex: 0 0 auto;
  display: flex;
  gap: 0.4rem;
  flex-direction: column;
`;

const ArrowButton = styled.button<{ disabled: boolean }>`
  cursor: pointer;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;
  background: inherit;

  svg {
    width: 1.5rem;
    height: 1.5rem;

    [fill] {
      &:not([fill='none']) {
        fill: ${(props) => (props.disabled ? `var(--grey1)` : `var(--primary1)`)};
      }
    }

    [stroke] {
      &:not([stroke='none']) {
        fill: ${(props) => (props.disabled ? `var(--grey1)` : `var(--primary1)`)};
      }
    }
  }
`;
