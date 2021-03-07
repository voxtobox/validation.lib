import ReactiveBase from './ReactiveBase.class';

export default class ValidationField extends ReactiveBase {
  constructor({ rules = {}, model, parentModel, ownKey }) {
    super();
    this.$setAll({
      _dirty: false,
      $params: {},
      $rules: rules,
      _parentModel: parentModel,
      _ownKey: ownKey,
      _model: model,
    });
    this._setNested();
    this._setRules();
  }

  get _keys() {
    return Object.keys(this.$rules);
  }

  get _nestedKeys() {
    return this._keys.filter(k => this._getIsKeyNested(k));
  }

  get _ruleKeys() {
    return this._keys.filter(k => !this._getIsKeyNested(k));
  }

  get $dirty() {
    return Boolean(this._dirty || (this._nestedKeys.length && this._nestedKeys.every(k => this[k].$dirty)));
  }

  get $invalid() {
    return this._ruleKeys.some(k => !this[k])
    || this._nestedKeys.some(k => this[k].$invalid);
  }

  get $error() {
    return this.$dirty && this.$invalid;
  }

  get $model() {
    return this._parentModel ? this._parentModel[this._ownKey] : this._model;
  }

  static withParams(params, validator) {
    return function withParams() {
      return {
        $params: params,
        $validator: (...args) => validator.apply(this, args)
      };
    }
  }

  _setDirty(isDirty) {
    this.$set('_dirty', isDirty);
    this._nestedKeys.forEach((k) => {
      this[k]._setDirty(isDirty);
    });
  }

  _getIsKeyNested(key) {
    return typeof this.$rules[key] !== 'function';
  }

  _setNested() {
    this._nestedKeys.forEach((k) => {
      if (!this[k]) {
        this[k] = new ValidationField({
          rules: this.$rules[k],
          parentModel: this.$model,
          ownKey: k,
        });
      }
    });
  }

  _setRules() {
    this._ruleKeys.forEach((k) => {
      let validator = this.$rules[k];
      if (validator.name === 'withParams') {
        const { $params, $validator } = validator();
        this.$params[k] = $params;
        validator = $validator;
      }
      Object.defineProperty(this, k, {
        get: () => validator.call(this, this.$model),
        enumerable: true,
      })
    });
  }

  $touch() {
    this._setDirty(true);
  }

  $reset() {
    this._setDirty(false);
  }
}
