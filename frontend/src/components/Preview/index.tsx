import React, { useState, useEffect, HTMLAttributes, MutableRefObject } from 'react';
import '@grapecity/spread-sheets-io';
import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
import GC from '@grapecity/spread-sheets';
import { useRecoilValue } from 'recoil';
import { FileType, deepClone, options } from '../../utils/spread';
import { selectedFileState } from '../../store/spread';
import { saveAs } from 'file-saver';
import styled from 'styled-components';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  forwardedRef: MutableRefObject<{ save: () => void }>;
}

function Preview({ forwardedRef, ...rest }: Props) {
  const [spread, setSpread] = useState<GC.Spread.Sheets.Workbook | null>(null);
  const selectedFile = useRecoilValue(selectedFileState);

  const fileType = FileType.Excel;

  let hostStyle = {
    width: '100%',
    height: '300px',
    border: '1px solid darkgray',
  };

  const initSpread = (spread: GC.Spread.Sheets.Workbook) => {
    setSpread(spread);
  };

  const open = () => {
    var file = selectedFile;
    if (!file) {
      return;
    }

    spread?.import(
      file,
      function () {},
      function () {},
      deepClone(options),
    );
    setSpread(spread);
  };

  const save = () => {
    var fileName = 'export.' + fileType;

    spread?.export(
      function (blob: Blob) {
        saveAs(blob, fileName);
      },
      function () {},
      deepClone(options),
    );
  };

  useEffect(() => {
    if (!selectedFile) return;
    open();
  }, [selectedFile]);

  useEffect(() => {
    if (forwardedRef && forwardedRef.current) {
      forwardedRef.current = {
        save,
      };
    }
  }, [forwardedRef, save]);
  return (
    <PreviewContainer {...rest}>
        <SpreadSheets workbookInitialized={(spread) => initSpread(spread)} hostStyle={hostStyle}>
          <Worksheet></Worksheet>
        </SpreadSheets>
    </PreviewContainer>
  );
}

export default Preview;

const PreviewContainer = styled.div`
  margin: 1.8rem 0;
  width: 100%;
`;
