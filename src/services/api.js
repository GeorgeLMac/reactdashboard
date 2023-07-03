import axios from "axios";

// location.hostname === "localhost" || location.hostname === "127.0.0.1"
// console.log(location.hostname)

const api = axios.create({

  //baseURL: 'backend'
   //baseURL: 'http://localhost:3333/'
   baseURL: 'https://iotmonitor-api-hml.syskeeper.com.br/'

});


// location.hostname === "localhost" || location.hostname === "127.0.0.1"
// console.log(location.hostname)
//baseURL: 'http://localhost:3333/',
// const api = axios.create({

//   baseURL:
//   location.hostname === "localhost" 
//   ? "https//iotmonitor-api-hml.syskeeper.com.br/"
//   : 'iotmonitor-api',



// });








export default api;
