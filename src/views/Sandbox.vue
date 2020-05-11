<template lang="pug">
  .sandbox
    VueCodeMirror(v-model="code" :options="cmOptions" @input="input" @isCleanUpdated="isCleanUpdated" @save="save")

    textarea(v-model="code")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'codemirror/mode/pug/pug';
import 'codemirror/theme/mbo.css';
import VueCodeMirror from '@/components/VueCodeMirror.vue';

@Component({
  components: {
    VueCodeMirror,
  },
})
export default class Sandbox extends Vue {
  code = '';

  cmOptions = {
    theme: 'mbo',
    mode: 'text/x-pug',
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    smartIndent: true,
    indentWithTabs: false,
  };

  input() {
    console.log('input');
  }

  isCleanUpdated(val: boolean) {
    console.log(`isCleanUpdated: ${val}`);
  }

  save() {
    console.log('save');
  }
}
</script>

<style></style>
