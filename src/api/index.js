import axios from "./resouce";
let url = process.env.VUE_APP_BASEURL;

export const get = () => {
  return axios.post(url);
};
export const post = params => {
  return axios.post(url, params);
};
