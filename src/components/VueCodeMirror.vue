<template lang="pug">
  codemirror#editor(ref="cmComponent" :value="value" :options="options" @input="input")
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref, Model } from 'vue-property-decorator';
import CodeMirror from 'codemirror';

interface CodeMirrorEditorInternal extends CodeMirror.Editor {
  save: (cm: CodeMirrorEditorInternal) => void;
}

interface VueCodeMirrorComponent extends Vue {
  content: string;
  codemirror: CodeMirrorEditorInternal;
  cminstance: CodeMirrorEditorInternal;
}

@Component
export default class VueCodeMirror extends Vue {
  private _isClean = true;

  @Model('input', { type: String, required: false })
  value!: string;

  @Prop()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private options!: Record<string, any>;

  @Ref() cmComponent!: VueCodeMirrorComponent;

  get isClean(): boolean {
    return this._isClean;
  }

  set isClean(val: boolean) {
    if (this._isClean !== val) {
      this._isClean = val;

      this.$emit('isCleanUpdated', this._isClean);
    }
  }

  setSize(width: string | number, height: string | number) {
    this.cmComponent.codemirror.setSize(width, height);
  }

  markClean() {
    this.cmComponent.codemirror.markClean();
  }

  input() {
    this.isClean = this.cmComponent.codemirror.isClean();
    this.$emit('input', this.cmComponent.content);
  }

  mounted() {
    this.cmComponent.codemirror.save = _cm => {
      this.isClean = this.cmComponent.codemirror.isClean();

      this.$emit('save');
    };

    // this.cmComponent.codemirror.setSize('100%', '100%');
  }
}
</script>

<style scoped lang="scss"></style>
