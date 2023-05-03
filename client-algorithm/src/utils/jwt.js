import jwtDecode from 'jwt-decode';
import axios from './axios'


const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
 }


const setSession = (accessToken) => {
    if (accessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        localStorage.setItem('accessToken', accessToken);
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('accessToken');
    }
}



export {setSession, isValidToken}