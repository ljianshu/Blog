// 接口模块二
import axios from './http'

function voteAdd() {
  return axios.post('/insertVote', {
    xxx: 'xxx'
  })
}

export default {voteAdd}