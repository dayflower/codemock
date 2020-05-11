/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'pug-parser' {
  import { Token } from 'pug-lexer';

  namespace parse {
    export type Ast = Record<string, any>;
  }

  function parse(tokens: Array<Token>, options?: Record<string, any>): parse.Ast;
  export = parse;
}
