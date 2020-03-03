// 接口模块一
import axios from './http'

function login(){
    return axios.post('/login');
}

export default {login}