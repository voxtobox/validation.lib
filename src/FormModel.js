import Vue from 'vue';
import {isObject} from './validation/utils';
import Validation from './validation/Validation.class';

const rules = {
  firstName: {
    required: Validation.withParams(
        { fieldName: 'firstName' },
            value => {
            return Boolean(value)
        }),
    minLength: value => value.length > 5,
  },
  lastName: {
    required: value => Boolean(value),
    minLength: value => value.length > 3
  },
};

export default class FormModel {
  constructor(data = {}) {
    this.$setAll(data);
    this.$setRules(rules);
  }

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

  $setRules(rules) {
    this.$v = new Validation({ rules, model: this });
  }
}

