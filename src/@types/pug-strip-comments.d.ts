declare module 'pug-strip-comments' {
  import { Token } from 'pug-lexer';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function stripComments(input: Array<Token>, options?: Record<string, any>): Array<Token>;
  export = stripComments;
}
