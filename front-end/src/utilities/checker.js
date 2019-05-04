const toString = Object.prototype.toString;

export const isBoolean = boo => {
  return typeof boo == 'boolean' ? true : false;
};

export const isTrue = boo => {
  return isBoolean(boo) && boo;
};

export const isFalse = boo => {
  return isBoolean(boo) && !boo;
};

export const isArray = val => {
  return toString.call(val) === '[object Array]';
};

export const isFormData = val => {
  return typeof FormData !== 'undefined' && val instanceof FormData;
};

export const isString = val => {
  return typeof val === 'string';
};

export const hasText = val => {
  return typeof val === 'string' && trim(val) != '';
};

export const emptyString = val => {
  return typeof val === 'string' && trim(val) == '';
};

export const isNumber = val => {
  return typeof val === 'number' && !Number.isNaN(val);
};

export const isUndefined = val => {
  return typeof val === 'undefined';
};

export const isObject = val => {
  return val !== null && typeof val === 'object';
};

export const isDate = val => {
  return toString.call(val) === '[object Date]';
};

export const isFile = val => {
  return toString.call(val) === '[object File]';
};

export const isBlob = val => {
  return toString.call(val) === '[object Blob]';
};

export const isFunction = val => {
  return toString.call(val) === '[object Function]';
};

export const isStream = val => {
  return isObject(val) && isFunction(val.pipe);
};

export const trim = str => {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
};

export const isColorHexCode = str => {
  let validRegex = new RegExp(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/);
  if (hasText(str)) {
    return validRegex.test(str);
  }
  return false;
};
