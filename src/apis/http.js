import axios from "axios"

class Http{
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 6000,
    });
    this.instance.interceptors.request.use((config) => {
      // const authstore = useAuthStore()
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = "JWT " + token
      }
      return config
    }) // 在发送请求前进行添加token
  }
  post(paht, data) {
    return new Promise( async (resolve, reject) => {
      try {
        const result = await this.instance.post(paht, data)
        resolve(result.data)
      } catch(err) {
        console.log(err)
        const detail = err.response.data.detail
        reject(detail)
      }
    })
  }
  get(path, parmas) {
    return new Promise(async (resolve, reject) => {
      // await 网络请求发送出去后，线程会挂起等待
      // 当网络数据发送回来后，线程又会继续执行
      // 使用 await 必须同时使用 async
      // axios底层也是使用promis对象，在响应的状态码不是200时，会调用reject函数
      try{
        const result = await this.instance.get(path, parmas)
        resolve(result.data)
      }catch(err){
        console.log(err)
        const detail = err.response.data.detail
        reject(detail)
      }
    })
  }
  put(path, data) {
    return new Promise(async (resolve, reject) => {
      // await 网络请求发送出去后，线程会挂起等待
      // 当网络数据发送回来后，线程又会继续执行
      // 使用 await 必须同时使用 async
      // axios底层也是使用promis对象，在响应的状态码不是200时，会调用reject函数
      try{
        const result = await this.instance.put(path, data)
        resolve(result.data)
      }catch(err){
        console.log(err)
        const detail = err.response.data.detail
        reject(detail)
      }
    })
  }
}

export default new Http()
