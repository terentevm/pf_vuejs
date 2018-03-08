import axios from "axios";

let jwt = sessionStorage.getItem('jwt');
let AUTH_TOKEN = " Bearer " + jwt; 

const HTTP = axios.create({
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": AUTH_TOKEN
    },
    data: {}
  });
  HTTP.defaults.headers.common['Authorization'] = AUTH_TOKEN;
  export {HTTP};