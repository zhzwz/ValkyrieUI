export const hasOwnProperty = function(object, name) {
  return Object.prototype.hasOwnProperty.call(object, name)
}
export const isArray = function(any) {
  return any instanceof Array
}
export const isValidArray = function(any) {
  return isArray(any) && (any.length > 0)
}

function isValidString(any) {
  const isString = typeof any === 'string'
  const nonEmpty = any !== ''
  return isString && nonEmpty
}

export const getColorIndexWithName = function(name) {
  const index = [
    /^<wht>/i,
    /^<hig>/i,
    /^<hiy>/i,
    /^<hic>/i,
    /^<hiz>/i,
    /^<hio>/i,
    /^<(hir|ord)>/i,
  ].findIndex(regexp => regexp.test(name))
  /* 以 <***> 开头但是判断不出颜色 */
  if (index === -1 && /^<...>/i.test(name)) {
    console.error(name)
  }
  return index + 1
}
