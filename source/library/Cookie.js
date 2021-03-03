export const getCookie = function(name) {
  const cookies = document.cookie.split(';').reduce((cookies, cookieString) => {
    const i = cookieString.indexOf('=')
    const name = cookieString.substr(0, i).trim()
    const value = cookieString.substr(i + 1)
    cookies[name] = value
    return cookies
  }, {})
  return cookies[name]
}

export const setCookie = function(name, value) {
  document.cookie = name + '=' + value
}

export const deleteCookie = function(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export default {
  getCookie,
  setCookie,
  deleteCookie,
}
