<template lang="pug">
  .home
    .toolbar
      b-button.mr-4(to="/" disabled)
        font-awesome-icon(:icon="['fas', 'chevron-circle-left']")
      b-button(to="/setting")
        font-awesome-icon(:icon="['fas', 'cog']")

    .d-flex.flex-wrap(style="justify-content: flex-start;/*space-between;*/")
      b-card.mx-3.my-3(no-body v-for="source in store.sources" bg-variant="secondary" style="flex-basis: 30%;")
        b-card-body
          b-card-title
            b-link(:to="{name: 'View', params: { id: source.id }}") {{source.title}}
          b-button(variant="danger" @click="removeSource(source.id)")
            font-awesome-icon(:icon="['fas', 'trash-alt']")

    b-button.ml-3(variant="primary" @click="add") Add
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { StoreMixin } from '@/logic/vuemixin';

@Component
export default class Home extends StoreMixin {
  removeSource(id: string) {
    this.store.removeSource(id);
  }

  add() {
    this.store.createSource();
  }
}
</script>

<style lang="scss">
.toolbar {
  padding: 0.8rem;
  background-color: #fff;
}
</style>
