import ReactiveBase from './ReactiveBase.class';

export default class ValidationField extends ReactiveBase {
  constructor({ params, model, parentModel, ownKey }) {
    super();
    this.$setAll({
      _dirty: false,
      $params: params,
      _parentModel: parentModel,
      _ownKey: ownKey,
      _model: model,
    });
    this._setNested();
    this._setRules();
  }

  get _keys() {
    return Object.keys(this.$params);
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

  _setDirty(isDirty) {
    this.$set('_dirty', isDirty);
    this._nestedKeys.forEach((k) => {
      this[k]._setDirty(isDirty);
    });
  }

  _getIsKeyNested(key) {
    return typeof this.$params[key] !== 'function';
  }

  _setNested() {
    this._nestedKeys.forEach((k) => {
      if (!this[k]) {
        this[k] = new ValidationField({
          params: this.$params[k],
          parentModel: this.$model,
          ownKey: k,
        });
      }
    });
  }

  _setRules() {
    this._ruleKeys.forEach((k) => {
      Object.defineProperty(this, k, {
        get: () => this.$params[k].call(this, this.$model),
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
