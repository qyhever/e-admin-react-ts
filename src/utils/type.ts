const toString = Object.prototype.toString

function createCheckTypeFn(type: string) {
  return function isType<T>(value: any): value is T {
    return toString.call(value) === `[object ${type}]`
  }
}

export const isFunc = createCheckTypeFn('Function')
export const isUndefined = createCheckTypeFn('Undefined')
export const isArray = createCheckTypeFn('Array')
export const isString = createCheckTypeFn('String')
export const isObject = createCheckTypeFn('Object')
export const isNumber = createCheckTypeFn('Number')

export function isHtmlElement(node: any) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

export function isDefined<T>(val: T | undefined): val is T {
  return val !== undefined && val !== null
}
