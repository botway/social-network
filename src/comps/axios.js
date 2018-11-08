import axios from 'axios';
export const CancelToken = axios.CancelToken;

var instance = axios.create({
    xsrfCookieName: 'mytoken',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
