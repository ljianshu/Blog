
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
## api接口的模块化管理规范（基于axios）
单独模块管理接口，其中http.js文件就是封装好的接口请求库
```
// personal.js文件
import axios from './http';
export default {
    login() {
        return axios.post('/login');
    },
    // ...
};
```
定义统一接口请求的入口 api.js
```
// api.js文件
import personal from './personal';
export default {
    personal
};
```
最后注入到vue的原型上
```
// main.js
import api from './api/api.js';
Vue.prototype.$api=api;
```
这样就可以在组件中使用了
```
//=>在组件中使用
 methods: {
    login() {
      this.$api.person.login().then(result => {
         console.log(result) // 直接就可以调用api,无需再引入api.js文件
        // 业务逻辑
      })
    }
  }
```
**本代码中提供了两种封装方式：axios和fetch，分别对应http.js和request.js文件**，项目中主要以前者为主
