import { Vue, Component } from 'vue-property-decorator';
import { Store } from '@/logic/domain';

export const store = Vue.observable<Store>(new Store());

@Component
export class StoreMixin extends Vue {
  get store(): Store {
    return store;
  }
}
