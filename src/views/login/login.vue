<script setup>
import { ref, reactive } from 'vue'
import { UserFilled, Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import user from '@/apis/user'

const LoginFormmRef = ref()
const LoginForm = reactive({
  email: '',
  password: '',
  validCode: '',
  username: ''
})
const formSize = '200px'
const formType = ref(false)
const handleChange = () => {
  formType.value = !formType.value
}

let flag = false // 计时器标识
const emailReg = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const countdown = reactive({
  validText: '获取验证码',
  time: 60,
  timer: null
})
// 倒计时与发送请求
const countdownChange = () => {
  if (flag) return
  if (!LoginForm.email || !emailReg.test(LoginForm.email)) {
    return ElMessage({
      message: '请检查邮箱是否正确',
      type: 'warning'
    })
  }
  //倒计时
  countdown.timer = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60
      countdown.validText = '验证码'
      flag = false
      clearInterval(countdown.timer)
    } else {
      countdown.time -= 1
      countdown.validText = `剩余${countdown.time}s`
    }

  }, 1000)
  flag = true
  user.getcaptcha(LoginForm.email, LoginForm.password, LoginForm.username).then((data) => {
    console.log( data )
    if (data.code === 200) {
        ElMessage({
          message: '发送成功',
          type: 'success',
        })
    }else {
    console.log('发送失败'); // 如果状态码不对，打印失败信息
  }
  }) 
}

// 校验
const validateEmail = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else {
    const emailReg = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    emailReg.test(value) ? callback() : callback(new Error('邮箱格式不正确'))
  }
}

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const passwordReg = /^[a-zA-Z0-9_-]{4,16}$/
    passwordReg.test(value) ? callback() : callback(new Error('密码格式不对，需要4——16位字符，请确认格式'))
  }
}

// 表单校验
const rules = reactive({
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  username: [{ required: true, message: '用户名是必填项' }]
})
</script>

<template>
  <div class="main">
    <el-card class="form-container" shadow="hover">
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{ formType ? '返回登陆' : '注册账号' }}</el-link>
      </div>
      <el-form ref="LoginFormmRef" style="max-width: 600px" :rules="rules" :model="LoginForm" label="登陆"
        label-width="auto" class="demo-ruleForm" :size="formSize" status-icon>
        <el-form-item v-if="formType" prop="username">
          <el-input v-model="LoginForm.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="LoginForm.email" placeholder="邮箱" :prefix-icon="UserFilled" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="LoginForm.password" placeholder="密码" :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="LoginForm.validCode" placeholder="验证码" :prefix-icon="Lock">
            <template #append>
              <span @click="countdownChange">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<style lang="less" scoped>
.main {
  background-image: url('@/assets/image/backgroud.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.form-container {
  width: 100%;
  max-width: 480px;
  padding: 20px;
  border-radius: 8px;
}

.jump-link {
  text-align: right;
  margin-bottom: 20px;
}
</style>
