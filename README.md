# 书城管理系统前端界面
## 1.技术栈
### 主要使用技术栈为Vue.js，在vue-element-admin基础上二次开发得来
## 2.技术实现
### 登录部分
* 使用ref通过注册引用信息的方式获取表单信息；使用$refs获得注册过引用信息的元素和组件实例，即获取表单信息；使用validate根据表单中':reules'绑定的校验规则进行校验；使用:model属性绑定的对象规定了表单的初始值
* 大写开启提示。通过判断输入大写字母时使用el-tooltip提示框进行提示
* 页面启动自动对焦。检查用户名或密码是否为空，为空时使用this.$refs.username.focus()自动对焦
* 点击显示密码后自动对焦到密码输入框。` this.$nextTick(() => { this.$refs.password.focus() }) `