import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';
import { ReactComponent as Picture } from '../../assets/picture.svg';
import { ReactComponent as Spinner } from '../../assets/icons/spinner.svg';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  description: string;
  boldDescription?: string;
  bottomAddon?: ReactElement;
  isLoading?: boolean;
}

function Banner({ description, boldDescription, bottomAddon, isLoading = false, ...rest }: Props) {
  return (
    <Container {...rest}>
      <PictureWrapper>
        <Picture />
      </PictureWrapper>
      <ContentWrapper>
        <Description>
          {description} <text>{boldDescription}</text>
        </Description>
        {bottomAddon}
      </ContentWrapper>
      {isLoading && (
        <SpinnerWrapper>
          <Spinner
            width={'3rem'}
            height={'3rem'}
            style={{ marginRight: '1.5rem', marginBottom: '1rem' }}
          />
        </SpinnerWrapper>
      )}
    </Container>
  );
}

export default Banner;

const Container = styled.div`
  position: relative;
  border-radius: 1.875rem;
  background: var(--primary1, #2e3192);
  box-shadow: var(--dropdown);
  color: white;
  display: flex;
  align-items: center;
  justify-items: center;
  height: 9.375rem;
  padding-left: 16rem;
  margin-top: 2rem;
  padding-right: 3rem;
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  align-self: flex-end;
`;

const PictureWrapper = styled.div`
  position: absolute;
  top: -2rem;
  left: 3rem;

  svg {
    width: 10.125rem;
  }
`;

const Description = styled.div`
  color: var(--white);
  font-size: 1.3rem;

  text {
    font-weight: var(--extraBold);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;
