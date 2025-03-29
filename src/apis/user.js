import http from "./http"

const login = (email, password) => {
  const path = '/auth/login'
  return http.post(path,{ email, password })
}

const register = (email, name, password, captcha) => {
  const path = '/auth/register'
  return http.post(path, { name, email, password, captcha })
}

const getcaptcha = (email, password, name) => {
  const path = '/auth/getcaptcha'
  return http.post(path, { email, password, name })
}

export default {
  login,
  register,
  getcaptcha
}