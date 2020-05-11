import Vue from 'vue';
import VueCodemirror from 'vue-codemirror';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/lib/codemirror.css';

VueCodemirror.CodeMirror.commands.save = cm => {
  cm.markClean();
  cm.save(cm);
};

Vue.use(VueCodemirror, {
  options: {
    // based on https://github.com/codemirror/CodeMirror/issues/988#issuecomment-549644684
    extraKeys: {
      Tab: cm => {
        if (cm.getMode().name === 'null') {
          cm.execCommand('insertTab');
        } else if (cm.somethingSelected()) {
          cm.execCommand('indentMore');
        } else {
          cm.execCommand('insertSoftTab');
        }
      },
      Backspace: cm => {
        if (!cm.somethingSelected()) {
          const cursorsPos = cm.listSelections().map(selection => selection.anchor);
          const { indentUnit } = cm.options;

          const shouldDelChar = cursorsPos.some(cursorPos => {
            const { start, end, string, type } = cm.getTokenAt(cursorPos);
            return (
              (type !== 'indent' && type !== null) ||
              start !== 0 ||
              end !== cursorPos.ch ||
              end === 0 ||
              string.trimStart() !== '' ||
              end % indentUnit > 0
            );
          });

          if (!shouldDelChar) {
            cm.execCommand('indentLess');
          } else {
            cm.execCommand('delCharBefore');
          }
        } else {
          cm.execCommand('delCharBefore');
        }
      },
      'Shift-Tab': cm => cm.execCommand('indentLess'),
    },
  },
});
