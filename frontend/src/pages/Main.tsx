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
import Request from '../components/Request';
import Button from '../components/Button';
import Preview from '../components/Preview';
import Result from '../components/Result';
import { useRecoilState } from 'recoil';
import { selectedFileState, FileLoadedState } from '../store/spread';
import InputButton from '../components/InputButton';
import { resultMessage } from '../utils/common';
import axios from 'axios';

function Main() {
  const previewRef = useRef<{
    save: () => void;
    applyFormula: (func: string, parameters: string[], cell: string) => void;
  }>({
    save: () => {},
    applyFormula: () => {},
  });
  const requestNumRef = useRef<number>(0);
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileState);
  const [fileLoadedStatus, setFileLoadedStatus] = useRecoilState(FileLoadedState);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // const [selectedRange, setSelectedRange] = useState<string>('');
  const [parameters, setParameters] = useState<string[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [excelFunc, setExcelFunc] = useState<string>('');
  const [reqNum, setReqNum] = useState(0);

  const handlePrevRequest = () => {
    if (requestNumRef.current === 0) return;
    requestNumRef.current -= 1;
    setReqNum((prev) => prev - 1);
  };

  const handleNextRequest = () => {
    if (requestNumRef.current == requests.length - 1) return;
    requestNumRef.current += 1;
    setReqNum((prev) => prev + 1);
  };

  function onSelectedFileChange(e: ChangeEvent<HTMLInputElement>) {
    let selectedFile = e.target?.files?.[0];
    selectedFile && setSelectedFile(selectedFile);
    setFileLoadedStatus('uploaded');
  }

  function onInputSubmit() {
    const enteredText = inputRef.current!.value;
    setFileLoadedStatus('loading');
    if (selectedFile && enteredText !== '') {
      axios.get('/api/text', { params: { text: enteredText } }).then((res) => {
        if (!res?.data) return;

        const data = res.data;
        const func = data.label;
        const questions = data.question;

        setFileLoadedStatus('loaded');
        setRequests(questions);
        setExcelFunc(func);
        setParameters(Array(questions.length).fill(''));

        setTimeout(() => {
          setFileLoadedStatus('preview');
        }, 1000);
      });
    }
  }

  const handlePreview = (range: string) => {
    setParameters((prevParameters) => {
      const changed = [...prevParameters];
      changed[requestNumRef.current] = range;
      return changed;
    });
  };

  const onSubmit = () => {
    setFileLoadedStatus('edit');
    console.log(parameters);
    previewRef.current?.applyFormula(
      excelFunc,
      parameters.slice(0, -1),
      parameters[parameters.length - 1],
    );
  };

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    (() => {
      window.addEventListener('beforeunload', preventClose);
    })();
    return () => {
      window.removeEventListener('beforeunload', preventClose);
    };
  }, []);

  return (
    <MainBlock>
      <Container>
        <Nav />
        <Contents>
          <LogoWrapper onClick={() => window.location.reload()}>
            <Logo />
          </LogoWrapper>
          {(fileLoadedStatus === 'ready' ||
            fileLoadedStatus === 'uploaded' ||
            fileLoadedStatus === 'loaded' ||
            fileLoadedStatus === 'loading') && (
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
          )}
          {
            <Preview
              forwardedRef={previewRef}
              handlePreview={handlePreview}
              setApplyStatus={setFileLoadedStatus}
              style={{
                display:
                  fileLoadedStatus === 'uploaded' ||
                  fileLoadedStatus === 'preview' ||
                  fileLoadedStatus === 'edit' ||
                  fileLoadedStatus === 'submit'
                    ? 'block'
                    : 'none',
              }}
            />
          }

          {(fileLoadedStatus === 'ready' ||
            fileLoadedStatus === 'uploaded' ||
            fileLoadedStatus === 'loaded' ||
            fileLoadedStatus === 'loading') && (
            <>
              <Command>Enter Request Action</Command>
              <Input
                ref={inputRef}
                placeholder={'Enter a message'}
                rightAddon={
                  <InputFormButton type='button' onClick={onInputSubmit}>
                    <Icon name='send' size={20} />
                  </InputFormButton>
                }
              />
            </>
          )}

          {(fileLoadedStatus === 'ready' ||
            fileLoadedStatus === 'loaded' ||
            fileLoadedStatus === 'loading') && (
            <Result
              status={fileLoadedStatus === 'loading' ? 'loading' : 'info'}
              style={{ marginBottom: '2rem', marginTop: '2rem' }}
            >
              {resultMessage[fileLoadedStatus]}
            </Result>
          )}

          {fileLoadedStatus === 'preview' && (
            <>
              <Request
                key={requests[requestNumRef.current].request}
                index={requestNumRef.current}
                lastIndex={requests.length - 1}
                item={requests[reqNum]}
                handlePrevRequest={handlePrevRequest}
                handleNextRequest={handleNextRequest}
                selectedRange={parameters?.[requestNumRef.current]}
                onSubmit={onSubmit}
                setParameters={setParameters}
              />
            </>
          )}
          {/* Output 용 */}
          {fileLoadedStatus === 'edit' && (
            <Result
              status={fileLoadedStatus === 'edit' ? 'loading' : 'info'}
              style={{ marginBottom: '2rem' }}
            >
              {resultMessage[fileLoadedStatus]}
            </Result>
          )}

          {fileLoadedStatus === 'submit' && (
            <Banner
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
              style={{ marginTop: 0 }}
            />
          )}
        </Contents>
        <Guides paramType={requests[requestNumRef.current]?.type} />
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
  cursor: pointer;
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
