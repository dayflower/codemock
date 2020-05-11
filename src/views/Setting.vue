<template lang="pug">
  .setting
    .toolbar
      b-button.mr-4(to="/")
        font-awesome-icon(:icon="['fas', 'chevron-circle-left']")
    div()
      b-card.mx-4.my-4(v-for="macro in macros" :key="macro.id" no-body)
        b-card-body
          b-card-title
            b-form(v-if="macro.isTagEditing" inline @submit.prevent="updateTag(macro.id)")
              b-form-input(v-model="macro.editingTag")
              b-button(variant="primary" type="submit") Update
              b-button(variant="outline-dark" @click="cancelUpdateTag(macro.id)") Cancel
            b-form(v-else inline @submit.prevent="")
              b-form-input(v-model="macro.tag" plaintext @click="macro.isTagEditing = true" :style="{ 'background-color': macro.isClean ? '' : '#fdd' }")
          VueCodeMirror.editor(
            :options="cmOptions" v-model="macro.editingTemplate"
            @save="saveTemplate(macro.id)" @isCleanUpdated="isCleanUpdated(macro.id, $event)"
            )
          b-button(variant="danger" @click="removeTemplate(macro.id)")
            font-awesome-icon(:icon="['fas', 'trash-alt']")
      b-button.mx-4.mb-4(variant="primary" @click="addTemplate") Add
    div(style="height: 1.5rem; background-color: #fcc;")
      |
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import 'codemirror/mode/pug/pug';
import 'codemirror/theme/mbo.css';
import VueCodeMirror from '@/components/VueCodeMirror.vue';
import { StoreMixin } from '@/logic/vuemixin';
import { Macro } from '@/logic/domain';

interface MacroWithClean extends Macro {
  isClean: boolean;
  isTagEditing: boolean;
  editingTag: string;
  editingTemplate: string;
}

@Component({
  components: {
    VueCodeMirror,
  },
})
export default class Setting extends StoreMixin {
  macros: Array<MacroWithClean> = [];

  cmOptions = {
    theme: 'mbo',
    mode: 'text/x-pug',
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    smartIndent: true,
    indentWithTabs: false,
  };

  saveTemplate(templateId: string) {
    const macro = this.macros.find(it => it.id === templateId);
    if (macro === undefined) {
      return;
    }
    macro.template = macro.editingTemplate;
    this.store.updateMacro(macro);
  }

  removeTemplate(templateId: string) {
    this.store.removeMacro(templateId);
    this.macros = this.macros.filter(it => it.id !== templateId);
  }

  isCleanUpdated(templateId: string, isClean: boolean) {
    const macro = this.macros.find(it => it.id === templateId);
    if (macro === undefined) {
      return;
    }
    macro.isClean = isClean;
  }

  updateTag(templateId: string) {
    const macro = this.macros.find(it => it.id === templateId);
    if (macro === undefined) {
      return;
    }
    macro.tag = macro.editingTag;
    this.store.updateMacro(macro);
    macro.isTagEditing = false;
  }

  cancelUpdateTag(templateId: string) {
    const macro = this.macros.find(it => it.id === templateId);
    if (macro === undefined) {
      return;
    }
    macro.editingTag = macro.tag;
    macro.isTagEditing = false;
  }

  addTemplate() {
    const id = this.store.createMacro();
    const macro = this.store.findMacro(id);
    if (macro !== undefined) {
      this.macros.push({
        ...macro,
        isClean: true,
        isTagEditing: false,
        editingTag: macro.tag,
        editingTemplate: macro.template,
      });
    }
  }

  mounted() {
    this.macros = this.store.macros.map(it => {
      return {
        ...it,
        isClean: true,
        isTagEditing: false,
        editingTag: it.tag,
        editingTemplate: it.template,
      };
    });
  }
}
</script>

<style>
.setting {
  width: 100%;
  height: 100%;
}

.setting .CodeMirror {
  height: auto;
}
</style>
