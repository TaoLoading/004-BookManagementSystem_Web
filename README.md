# 书城管理系统前端界面
## 1.技术栈
主要使用技术栈为Vue.js，在vue-element-admin基础上二次开发得来
## 2.部分技术实现
1. 登录实现
   1. 使用ref通过注册引用信息的方式获取表单信息；使用$refs获得注册过引用信息的元素和组件实例，即获取表单信息；使用validate根据表单中':reules'绑定的校验规则进行校验；使用:model属性绑定的对象规定了表单的初始值
   2. **大写开启提示**。通过判断输入大写字母时使用el-tooltip提示框进行提示
   3. **页面启动自动对焦**。检查用户名或密码是否为空，为空时使用` this.$refs.username.focus() `自动对焦
   4. **点击显示密码后自动对焦到密码输入框**。` this.$nextTick(() => { this.$refs.password.focus() }) `
2. 前端异常信息显示实现
   1. 接收后端传过来经过加工的错误响应信息
   2. 在utils/request.js文件内响应拦截器` service.interceptors.response.use() `中的error进行处理
      * 获取错误信息。` const { msg } = error.response.data `
      * 生成错误信息弹窗。` Message({ message: msg || '请求失败', type: 'error', duration: 5 * 1000 }) `
   3. 修改utils/request.js内请求拦截器` service.interceptors.request.use `中的config设置为`config.headers['Authorization'] =` `Bearer ${getToken()}`。这是因为由于后端添加路由的jwt认证，故前端需要传递符合规则的token
3. 上传电子书组件实现
   * `:action="action"`
   * `:headers="headers"`
   * `:multiple="false"`
   * `:limit="1"`
   * `:before-upload="beforeUpload"`
   * `:on-success="onSuccess"`
   * `:on-error="onError"`
   * `:on-remove="onRemove"`
   * `:file-list="fileList"`
   * `:on-exceed="onExceed"`
   * `:disabled="disabled"`
   * `drag`
   * `show-file-list`
   * `accept="application/epub+zip"`
4. 