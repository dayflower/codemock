declare module 'pug-code-gen' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Ast = Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function generateCode(ast: Ast, options: Record<string, any>): string;
  export = generateCode;
}
