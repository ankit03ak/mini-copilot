declare module "react-syntax-highlighter" {
  import * as React from "react";

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    customStyle?: React.CSSProperties;
    children?: React.ReactNode;
    showLineNumbers?: boolean;
    wrapLongLines?: boolean;
    wrapLines?: boolean;
    lineNumberStyle?: React.CSSProperties;
  }

  export class Prism extends React.Component<SyntaxHighlighterProps> {}
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const atomDark: any;
  export const prism: any;
}
