declare module 'pug-walk' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Ast = Record<string, any>;

  type ReplaceFunction = (replacement: Ast | Array<Ast>) => void;

  type WalkingFunction = (ast: Ast, replace: ReplaceFunction) => boolean | void;

  function walkAST(
    ast: Ast,
    before: WalkingFunction | null | undefined,
    after: WalkingFunction | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>
  ): Ast;
  function walkAST(
    ast: Ast,
    before: WalkingFunction | null | undefined,
    after: WalkingFunction | null | undefined
  ): Ast;
  function walkAST(
    ast: Ast,
    before: WalkingFunction | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>
  ): Ast;
  function walkAST(ast: Ast, before: WalkingFunction): Ast;
  export = walkAST;
}
