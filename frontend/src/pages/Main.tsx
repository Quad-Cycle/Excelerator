/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../components/Nav';
import Guides from '../components/Guides';
import { ReactComponent as Logo } from '../assets/logo.svg';
import Banner from '../components/Banner';
import Command from '../components/Command';
import Input from '../components/TextField';
import Icon from '../components/Icon';
// import Result from '../components/Result';
import Request from '../components/Request';
import Button from '../components/Button';
import Preview from '../components/Preview';
import Result from '../components/Result';
import * as XLSX from 'xlsx';
import { useRecoilState } from 'recoil';
import { spreadState, selectedFileState, FileLoadedState } from '../store/spread';
import InputButton from '../components/InputButton';
import { resultMessage } from '../utils/common';
import axios from 'axios';

function Main() {
  const previewRef = useRef<{ save: () => void }>({ save: () => {} });
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileState);
  const [fileLoadedStatus, setFileLoadedStatus] = useRecoilState(FileLoadedState);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 임시 데이터
  const [reqNum, setReqNum] = useState(0);
  const requests: RequestType[] = [
    { request: '엑셀에서 데이터를 가진 전체 범위(데이터베이스)를 지정해주세요.', type: 'database' },
    { request: '값을 더해나갈 특정 필드를 선택하세요.', type: 'field' },
    { request: '더하는 조건을 범위로 설정합니다.', type: 'criteria' },
    { request: '구한 결과 값을 작성할 셀의 위치를 지정하세요.', type: 'result' },
  ];

  const handlePrevRequest = () => {
    if (reqNum === 0) return;
    setReqNum((prev) => prev - 1);
  };

  const handleNextRequest = () => {
    if (reqNum == requests.length - 1) return;
    setReqNum((prev) => prev + 1);
  };

  function onSelectedFileChange(e: ChangeEvent<HTMLInputElement>) {
    let selectedFile = e.target?.files?.[0];
    selectedFile && setSelectedFile(selectedFile);
  }

  function onSubmit() {
    const enteredText = inputRef.current!.value;
    if (selectedFile && enteredText !== '') {
      console.log(enteredText);
      setFileLoadedStatus('loading');

      axios.get('/api/text', { params: { text: enteredText } }).then((res) => {
        console.log(res.data.data);
      });
    }
  }

  return (
    <MainBlock>
      <Container>
        <Nav />
        <Contents>
          <LogoWrapper>
            <Logo />
          </LogoWrapper>
          {/* Input용 */}
          <Banner
            description={'Upload your'}
            boldDescription={'excel file'}
            bottomAddon={
              selectedFile ? (
                <InputButton
                  text={selectedFile.name}
                  icon={'clip'}
                  onChange={onSelectedFileChange}
                />
              ) : (
                <InputButton text={'Upload'} icon={'upload'} onChange={onSelectedFileChange} />
              )
            }
          />

          <Command>Enter Request Action</Command>
          <Input
            ref={inputRef}
            placeholder={'Enter a message'}
            rightAddon={
              <InputFormButton type='button' onClick={onSubmit}>
                <Icon name='send' size={20} />
              </InputFormButton>
            }
          />
          <Result
            status={fileLoadedStatus === 'loading' ? 'loading' : 'info'}
            style={{ marginBottom: '2rem' }}
          >
            {resultMessage[fileLoadedStatus]}
          </Result>

          {/* {<Preview forwardedRef={previewRef} />} */}
          {/* Output 용 */}
          {/* <Banner
            description={'Download'}
            boldDescription={'edited excel file'}
            bottomAddon={
              <BannerBottomAddon>
                <Button text={'Download'} icon={'download'} onClick={previewRef.current?.save} />
                <div>
                  <Button text={'Continue'} icon={'continue'} />
                  <Button text={'Rollback'} icon={'rollback'} />
                </div>
              </BannerBottomAddon>
            }
          /> */}
          {/* <Request
            key={requests[reqNum].request}
            index={reqNum}
            lastIndex={requests.length - 1}
            item={requests[reqNum]}
            handlePrevRequest={handlePrevRequest}
            handleNextRequest={handleNextRequest}
          /> */}
        </Contents>
        <Guides />
      </Container>
    </MainBlock>
  );
}

export default Main;

const MainBlock = styled.main`
  width: 100%;
  height: 100%;
  background: var(--primary3);
  box-sizing: border-box;
  padding: 3rem;
`;

const Container = styled.section`
  width: 100%;
  height: 100%;
  border-radius: 3.125rem;
  background: var(--primary2, #f6faff);
  box-shadow: 0px 10px 30px 20px rgba(201, 201, 201, 0.25);
  display: flex;
`;

const Contents = styled.section`
  width: 100%;
  flex: 1;
  padding-top: 4rem;
  padding: 4rem 3.5rem 2.5rem 0;
  display: flex;
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  svg {
    width: 12rem;
  }
`;

const BannerBottomAddon = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const InputFormButton = styled.button`
  background: inherit;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;
  cursor: pointer;
`;
