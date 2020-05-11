import walk from 'pug-walk';

import lex from 'pug-lexer';
import parse, { Ast } from 'pug-parser';
import stripComments from 'pug-strip-comments';

export class PugCustomTagReplacer {
  // eslint-disable-next-line no-shadow, no-useless-constructor
  constructor(private macros: Record<string, Ast>) {}

  // eslint-disable-next-line class-methods-use-this
  replaceCustomTags(ast: Ast): Ast {
    return walk(ast, null, (node, replace) => {
      if (node.type !== 'Tag') {
        return;
      }

      const macro = this.macros[node.name];

      if (macro === undefined) {
        return;
      }

      replace(PugCustomTagReplacer.embedVariablesForMacro(macro, node));
    });
  }

  private static embedVariablesForMacro(macro: Ast, targetNode: Ast): Ast {
    const children =
      targetNode.block && Array.isArray(targetNode.block.nodes) ? targetNode.block.nodes : [];

    const attrs: Record<string, string> = Object.fromEntries(
      targetNode.attrs.map((it: { name: string }) => [it.name, it])
    );

    const vals: Record<string, string> = Object.fromEntries(
      targetNode.attrs
        .map((it: { name: string; val: string }) => {
          const quoteMatches = it.val.match(/^'(.*)'$/);
          if (quoteMatches !== null) {
            return [it.name, quoteMatches[1]];
          }

          const dquoteMatches = it.val.match(/^"(.*)"$/);
          if (dquoteMatches !== null) {
            return [it.name, dquoteMatches[1]];
          }

          return undefined;
        })
        .filter((it: undefined) => it !== undefined)
    );

    const replaceVal: (str: string) => string = (str: string) => {
      return str.replace(/\{\{(.*?)\}\}/g, (_match, directive) => {
        const matches = directive.match(/^(.+?)\|(.+)/);
        const field = matches !== null ? matches[1] : directive;
        const defval = matches !== null ? matches[2] : '';

        delete attrs[field];
        return vals[field] || defval;
      });
    };

    // TODO: add remaining attr
    return walk(PugCustomTagReplacer.deepClone(macro), null, (node, replace) => {
      if (node.type === 'Text') {
        replace({ ...node, val: replaceVal(node.val) });
      } else if (node.type === 'Tag') {
        if (node.name === 'slot') {
          replace(children);
        } else {
          replace({
            ...node,
            attrs: node.attrs.map((it: { val: string }) => {
              return { ...it, val: replaceVal(it.val) };
            }),
          });
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static deepClone(value: any): any {
    return JSON.parse(JSON.stringify(value));
  }
}

export function stripHeadingIndent(src: string): string {
  const lines = src.replace(/^\n*/, '').split(/\n/);
  if (lines.length > 0) {
    const indent = lines[0].match(/^[ ]+/);
    if (indent !== null) {
      const re = new RegExp(`^[ ]{1,${indent[0].length}}`);
      return lines.map(it => it.replace(re, '')).join('\n');
    }
  }
  return src;
}

export function parseToAst(str: string): Ast {
  return parse(stripComments(lex(stripHeadingIndent(str))));
}

//   pug.render(source, {
//     pretty: true,
//     plugins: [
//       {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         preCodeGen: (ast: Ast, _options: Record<string, any>): Ast => {
//           const pctr = new PugCustomTagReplacer(
//             Object.fromEntries(
//               Object.entries(macros).map(it => {
//                 return [it[0], parse(stripComments(lex(stripHeadingIndent(it[1]))))];
//               })
//             )
//           );
//
//           return pctr.replaceCustomTags(ast);
//         },
//       },
//     ],
//   })
