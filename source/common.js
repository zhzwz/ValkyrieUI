export const on = (type, handler) => ValkyrieWorker.on(type, handler)
export const once = (type, handler) => ValkyrieWorker.once(type, handler)
export const off = id => ValkyrieWorker.off(id)

export const setValue = Common.setValue
export const getValue = Common.getValue

export const addStyle = Common.addStyle
export const addStyleByURL = Common.addStyleByURL

export const appendElement = Common.appendElement
export const removeElement = Common.removeElement

export const hasOwn = Common.hasOwn
export const getCookie = Common.getCookie
export const getColorSortByName = Common.getColorSortByName
