export function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function withParams(params, validator) {
  return function withParams() {
    return {
      $params: params,
      $validator: (...args) => validator.apply(this, args)
    };
  }
}
