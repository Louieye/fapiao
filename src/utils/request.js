import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'http://172.17.255.237:8080/wdhis-core-web', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: { // 请求头设置
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    
    return config
  },
  error => {
    // do something with request error
    console.log('request error') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // let res
    // if (response.data.access_token && response.data.access_token.length > 0) {
    //   res = response
    // } else {
    //   res = JSON.parse(response.data)
    //   console.log('json', res);

    // }
    const res = response
    // if the custom code is not 20000, it is judged as an error.
    console.log('【返回数据】', res)
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
