<template lang="pug">
  .about
    .d-flex.flex-column
      .toolbar(:class="isClean ? 'contentIsClean' : 'contentIsDirty'")
        b-button.mr-4(to="/")
          font-awesome-icon(:icon="['fas', 'chevron-circle-left']")
        EditModeToolBar(v-model="editMode")
        div
          b-form(v-if="isTitleEditing" inline @submit.prevent="updateTitle")
            b-form-input(v-model="editingSource.title")
            b-button(variant="primary" type="submit") Update
            b-button(variant="outline-dark" @click="cancelUpdateTitle") Cancel
          b-form(v-else inline @submit.prevent="")
            b-form-input(v-model="editingSource.title" plaintext @click="isTitleEditing = true")
      div.flex-grow-1.row(style="background-color: #cfc;")
        VueCodeMirror#editor.col(
          v-if="editMode !== 'VIEW'"
          ref="cmComponent" v-model="editingSource.source" :options="cmOptions"
          @save="saved" @isCleanUpdated="isCleanUpdated")
        iframe#preview.col(
          v-if="editMode !== 'EDIT'"
          src="about:blank" :srcdoc="rendered")
      div(style="height: 1.5rem; background-color: #fcc;")
        |
</template>

<script lang="ts">
import { Component, Ref } from 'vue-property-decorator';
import 'codemirror/mode/pug/pug';
import 'codemirror/theme/mbo.css';
import VueCodeMirror from '@/components/VueCodeMirror.vue';
import EditModeToolBar, { EditMode } from '@/components/EditModeToolBar.vue';
import { StoreMixin } from '@/logic/vuemixin';
import { Source } from '@/logic/domain';

@Component({
  components: { VueCodeMirror, EditModeToolBar },
})
export default class About extends StoreMixin {
  isClean = true;

  editMode: EditMode = EditMode.BOTH;

  id = '';

  source: Source | undefined;

  editingSource: Source = { id: '', title: '', source: '' };

  isTitleEditing = false;

  rendered = '';

  cmOptions = {
    theme: 'mbo',
    mode: 'text/x-pug',
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    smartIndent: true,
    indentWithTabs: false,
  };

  @Ref() cmComponent!: VueCodeMirror;

  get previewComponent(): HTMLIFrameElement {
    return document.getElementById('preview') as HTMLIFrameElement;
  }

  isCleanUpdated(val: boolean) {
    this.isClean = val;
  }

  saved() {
    try {
      this.rendered = this.store.render(this.editingSource.source);
      this.store.updateSource(this.editingSource);
      this.source = this.store.findSource(this.id);
      if (this.source === undefined) {
        throw new Error();
      }
    } catch (e) {
      console.error(e);
    }
  }

  updateTitle() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.store.updateSource(this.editingSource);
    this.source = this.store.findSource(this.id);
    this.isTitleEditing = false;
  }

  cancelUpdateTitle() {
    this.editingSource.title = this.source?.title || '';
    this.isTitleEditing = false;
  }

  mounted() {
    this.cmComponent.setSize('100%', '100%');

    this.id = this.$route.params.id;
    this.source = this.store.findSource(this.id);
    if (this.source === undefined) {
      throw new Error();
    }
    this.editingSource = { ...this.source };
    this.cmComponent.markClean();
    this.isClean = true;
    this.rendered = this.store.render(this.editingSource.source);
  }
}
</script>

<style>
.about {
  width: 100%;
  height: 100%;
}

.about > div {
  width: 100%;
  height: 100%;
}

#editor {
  padding: 0;
  overflow: hidden;
  border: solid 1px #ccc;
  background-color: #cff;
}

#preview {
  padding: 0;
  border: solid 1px #ccc;
  background-color: #ffc;
  /* overflow: scroll; */
}

.half {
  flex-basis: 50%;
}

.contentIsDirty {
  background-color: #fcc;
}

.contentIsClean {
  background-color: #ccf;
}
</style>
