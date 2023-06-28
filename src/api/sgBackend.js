import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sg.radioperu.pe/api',
  //   baseURL: 'http://192.168.1.171:3002/api',
  headers: {
    'Content-type': 'application/json',
  },
});

export default instance;
