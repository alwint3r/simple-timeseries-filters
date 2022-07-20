export function isNumber(num: unknown) {
  return typeof num === 'number' && !isNaN(num);
}