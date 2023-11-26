import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import Input from '../Input';
import Toggle from './ToggleInput';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  type: ParameterType;
  selectedRange?: string;
  updateParameters: (value: any) => void;
}

function RequestInput({ type, selectedRange, updateParameters }: Props) {
  switch (type) {
    case 'cell':
    case 'range':
      return (
        <InputWrapper>
          <Input type={'text'} defaultValue={selectedRange} readOnly={true} />
        </InputWrapper>
      );
    case 'number':
      return (
        <InputWrapper>
          <Input placeholder={'숫자를 입력해주세요.'} type={'number'} />
        </InputWrapper>
      );
    case 'list':
      return (
        <InputWrapper>
          <Input type={'text'} placeholder={'리스트 형식으로 텍스트를 입력해주세요.'} />
        </InputWrapper>
      );
    case 'criteria':
      return (
        <InputWrapper>
          <Input type={'text'} placeholder={'조건을 지정하는 수, 식 또는 텍스트를 입력해주세요.'} />
        </InputWrapper>
      );

    case 'boolean':
      return (
        <InputWrapper>
          <Toggle updateParameters={updateParameters} />
        </InputWrapper>
      );
    case 'text':
    default:
      return (
        <InputWrapper>
          <Input type={'text'} placeholder={'텍스트를 입력해주세요.'} />
        </InputWrapper>
      );
  }
}

export default RequestInput;

const InputWrapper = styled.div``;
