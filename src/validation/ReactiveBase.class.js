import Vue from 'vue';
import { isObject } from './utils';

export default class ReactiveBase {
  $set(name, value, model = this) {
    Vue.set(model, name, value);
  }

  $setAll(data, model = this) {
    if (!data || typeof data !== 'object') return;
    Object.entries(data)
    .forEach(([key, value]) => {
      // If value is object and model exist as object too
      if (isObject(value) && isObject(model[key])) {
        // Call recursive to not lost observe set by field params in object
        this.$setAll(value, model[key]);
      } else {
        this.$set(key, value, model);
      }
    });
  }
}
