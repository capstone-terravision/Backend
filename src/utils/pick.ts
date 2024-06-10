/**
 * Create an object composed of the picked object properties
 * @param {object} object
 * @param {string[]} keys
 * @returns {object}
 */
const pick = (object: { [key: string]: any }, keys: string[]): { [key: string | number]: any } => {
  return keys.reduce(
    (obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
      return obj;
    },
    {} as { [key: string]: any },
  );
};

export default pick;
