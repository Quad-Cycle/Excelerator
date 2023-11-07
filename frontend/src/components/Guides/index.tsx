import React from 'react';
import styled from 'styled-components';
import Alert from '../Alert';

function Guides() {
  return (
    <GuidesPanel>
      <PanelTitle>Guides</PanelTitle>
      <AlertContainer>
        <Alert
          title={'엑셀 파일 업로드하기'}
          content={
            '수정을 원하는 엑셀 파일을 업로드합니다. 파일 확장자는 .xls 혹은 .xlsx만 가능합니다.'
          }
          theme={'blue'}
        ></Alert>
      </AlertContainer>
    </GuidesPanel>
  );
}

export default Guides;

const GuidesPanel = styled.aside`
  width: 20rem;
  height: 100%;
  float: right;
  border-radius: 0rem 3.125rem 3.125rem 0rem;
  background: var(--white);
  padding: 2rem;
  padding-top: 6rem;
  flex: 0 0 auto;
`;

const PanelTitle = styled.h3`
  font-weight: var(--extraBold);
  font-size: var(--title);
  text-align: left;
  margin-bottom: 1.3rem;
`;

const AlertContainer = styled.div``;
