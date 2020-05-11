<template lang="pug">
  b-button-group
    b-button(ref="EDIT" :pressed="editPressed" @click="buttonClick($event, 'EDIT')")
      font-awesome-icon(:icon="['fas', 'pencil-alt']")
    b-button(ref="BOTH" :pressed="bothPressed" @click="buttonClick($event, 'BOTH')")
      font-awesome-icon(:icon="['fas', 'columns']")
    b-button(ref="VIEW" :pressed="viewPressed" @click="buttonClick($event, 'VIEW')")
      font-awesome-icon(:icon="['fas', 'eye']")
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';

export enum EditMode {
  EDIT = 'EDIT',
  BOTH = 'BOTH',
  VIEW = 'VIEW',
}

@Component
export default class EditModeToolBar extends Vue {
  @Model('input', { type: String, required: true })
  value!: EditMode;

  buttonClick(event: Event, mode: EditMode) {
    (this.$refs[mode] as HTMLButtonElement).blur();
    this.$emit('input', mode);
  }

  get editPressed(): boolean {
    return this.value === EditMode.EDIT;
  }

  get bothPressed(): boolean {
    return this.value === EditMode.BOTH;
  }

  get viewPressed(): boolean {
    return this.value === EditMode.VIEW;
  }
}
</script>

<style scoped lang="scss"></style>
