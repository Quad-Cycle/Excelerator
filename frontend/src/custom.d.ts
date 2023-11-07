type Status = 'info' | 'warning' | 'error' | 'success';
type ColorType =
  | 'red'
  | 'blue'
  | 'geekblue'
  | 'green'
  | 'lime'
  | 'purple'
  | 'orange'
  | 'gold'
  | 'magenta'
  | 'cyan'
  | 'grey'
  | 'primary';

interface RequestType {
  request: string;
  type: string;
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
