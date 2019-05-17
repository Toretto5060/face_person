import axios from "axios";

axios.defaults.timeout = 5000;
// http request 请求拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return error;
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          break;
      }
    }
    return Promise.reject(error.response);
  }
);
export default axios;
