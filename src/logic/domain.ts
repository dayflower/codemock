import { parseToAst, PugCustomTagReplacer, stripHeadingIndent } from '@/logic/pugtag';
import generateCode from 'pug-code-gen';
import shortid from 'shortid';
import { v4 as uuidv4 } from 'uuid';

const defaultTemplate = `
<!DOCTYPE html>
<html style="overflow: scroll;">
  <head>
    <title>title</title>
    <link rel="stylesheet" type="text/css" href="https://bootswatch.com/4/sketchy/bootstrap.css" />
    <style>
      body {
        margin: 2rem;
      }
    </style>
  </head>
  <body>{{body}}</body>
</html>
`;

const defaultMacros = [
  {
    id: '45bafa5e-9563-4039-8d35-f0a290388b13',
    tag: 'form-button',
    template: `
      button(type="button" class="btn btn-{{type|primary}}")
        | {{label|Button}}
    `,
  },
];

const defaultSources = [
  {
    id: '7991998c-01a5-4bc5-99c7-197f45376b8c',
    title: 'example',
    source: `
      form-button(label="Test")
    `,
  },
];

export interface Macro {
  id: string;
  tag: string;
  template: string;
}

export interface Source {
  id: string;
  title: string;
  source: string;
}

export class Store {
  private _wrapper: string;

  macros: Array<Macro>;

  sources: Array<Source>;

  constructor() {
    const storedWrapper = window.localStorage.getItem('wrapper');
    if (storedWrapper !== null) {
      this._wrapper = storedWrapper;
    } else {
      this._wrapper = defaultTemplate;
    }

    const storedMacros = window.localStorage.getItem('macros');
    if (storedMacros !== null) {
      this.macros = JSON.parse(storedMacros);
    } else {
      this.macros = defaultMacros.map(it => {
        return { ...it, template: stripHeadingIndent(it.template) };
      });
    }

    const storedSources = window.localStorage.getItem('sources');
    if (storedSources !== null) {
      this.sources = JSON.parse(storedSources);
    } else {
      this.sources = defaultSources.map(it => {
        return { ...it, source: stripHeadingIndent(it.source) };
      });
    }
  }

  get wrapper() {
    return this._wrapper;
  }

  set wrapper(template: string) {
    this._wrapper = template;
    this.syncWrapperToStorage();
  }

  private syncWrapperToStorage() {
    window.localStorage.setItem('wrapper', this._wrapper);
  }

  private syncMacrosToStorage() {
    window.localStorage.setItem(
      'macros',
      JSON.stringify(
        this.macros.map(it => {
          return { ...it, template: stripHeadingIndent(it.template) };
        })
      )
    );
  }

  private syncSourcesToStorage() {
    window.localStorage.setItem(
      'sources',
      JSON.stringify(
        this.sources.map(it => {
          return { ...it, source: stripHeadingIndent(it.source) };
        })
      )
    );
  }

  findMacro(id: string): Macro | undefined {
    return this.macros.find(it => it.id === id);
  }

  createMacro(): string {
    const id = uuidv4();
    const macro = {
      id,
      tag: shortid.generate(),
      template: '',
    };

    this.macros.push(macro);
    this.syncMacrosToStorage();

    return id;
  }

  updateMacro(macro: Macro) {
    const target = this.macros.find(it => it.id === macro.id);
    if (target !== undefined) {
      target.tag = macro.tag;
      target.template = macro.template;
      this.syncMacrosToStorage();
    } else {
      throw new Error('');
    }
  }

  removeMacro(id: string) {
    this.macros = this.macros.filter(it => it.id !== id);
    this.syncMacrosToStorage();
  }

  findSource(id: string): Source | undefined {
    return this.sources.find(it => it.id === id);
  }

  createSource(): string {
    const id = uuidv4();
    const source = {
      id,
      title: new Date().toISOString(),
      source: '',
    };

    this.sources.push(source);
    this.syncSourcesToStorage();

    return id;
  }

  updateSource(source: Source) {
    const target = this.sources.find(it => it.id === source.id);
    if (target !== undefined) {
      target.title = source.title;
      target.source = source.source;
      this.syncSourcesToStorage();
    } else {
      throw new Error('');
    }
  }

  removeSource(id: string) {
    this.sources = this.sources.filter(it => it.id !== id);
    this.syncSourcesToStorage();
  }

  render(source: string): string {
    const macroes = Object.fromEntries(
      this.macros.map(it => [it.tag, parseToAst(stripHeadingIndent(it.template))])
    );
    const replacer = new PugCustomTagReplacer(macroes);

    const code = generateCode(replacer.replaceCustomTags(parseToAst(stripHeadingIndent(source))), {
      pretty: true,
      compileDebug: false,
    });

    // eslint-disable-next-line no-new-func
    const compiled = new Function(`${code}; return template();`);

    return this.wrapper.replace('{{body}}', compiled());
  }
}
