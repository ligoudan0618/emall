<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent :model="model" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item class="btn-login">
          <el-button
            type="primary"
            native-type="submit"
            :disabled="!(model.username && model.password)"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    async login() {
      const res = await this.$http.post("login", this.model);
      //   console.log(res);
      sessionStorage.token = res.data.token;
      this.$router.push("/");
      this.$message({
        type: "success",
        message: "登陆成功！",
      });
    },
  },
};
</script>

<style>
.login-card {
  width: 25rem;
  margin: 5rem auto;
}

.btn-login {
  display: flex;
  justify-content: flex-end;
}
</style>
