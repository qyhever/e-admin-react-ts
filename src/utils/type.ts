const toString = Object.prototype.toString

function createCheckTypeFn<T>(type: string) {
  return function isType(value: any): value is T {
    return toString.call(value) === `[object ${type}]`
  }
}

export const isFunc = createCheckTypeFn<Function>('Function')
export const isUndefined = createCheckTypeFn<undefined>('Undefined')
export const isString = createCheckTypeFn<string>('String')
export const isObject = createCheckTypeFn('Object')
export const isNumber = createCheckTypeFn<number>('Number')

export function isHtmlElement(node: any) {
  return node && node.nodeType === Node.ELEMENT_NODE
}

export function isDefined<T>(val: T | undefined): val is T {
  return val !== undefined && val !== null
}
