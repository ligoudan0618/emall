<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <!-- :default-openeds="['1', '3']" -->
        <el-menu
          router
          unique-opened
          :default-active="$route.path"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-message"></i>内容管理</template
            >

            <el-menu-item-group title="商品">
              <el-menu-item index="/products/edit">新建商品</el-menu-item>
              <el-menu-item index="/products/list">商品列表</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group title="订单">
              <el-menu-item index="/orders/list">订单列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="评论">
              <el-menu-item index="/reviews/list">评论列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-s-promotion"></i>运营管理</template
            >
            <el-menu-item-group title="轮播图">
              <el-menu-item index="/swipers/edit">添加轮播图</el-menu-item>
              <el-menu-item index="/swipers/list">轮播图列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="首页推荐">
              <el-menu-item index="/recommendedation/edit"
                >添加首页推荐</el-menu-item
              >
              <el-menu-item index="/recommendedation/list"
                >首页推荐列表</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"
              ><i class="el-icon-setting"></i>系统设置</template
            >
            <el-menu-item-group>
              <template slot="title">分类</template>
              <el-menu-item index="/categories/edit">新建分类</el-menu-item>
              <el-menu-item index="/categories/list">分类列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">用户</template>
              <el-menu-item index="/users/list">用户列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">管理员</template>
              <el-menu-item index="/admin_users/create"
                >新建管理员</el-menu-item
              >
              <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-header>
          <div class="left">
            <img src="../assets/myLogo.png" alt="" height="100%" />
            <h1>商铺后台管理系统</h1>
          </div>
          <div class="rigth">
            <el-button type="danger" size="small" @click="logout"
              >注销</el-button
            >
          </div>
        </el-header>
        <el-card v-if="$route.path !== '/'">
          <!-- 两个页面用了相同的组件，router-view默认是用组件进行区分的 切换时会有 bug  -->
          <router-view :key="$route.path"></router-view>
        </el-card>
        <div v-else class="welcome">
          <h5>你已进入商城后台管理系统！</h5>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
}

.el-main {
  padding: 10px;
}

.el-aside {
  color: #333;
}

.el-header .left {
  display: flex;
  font-size: 28px;
  align-items: center;
  overflow: hidden;
}

.el-header .left img {
  margin-top: -10px;
}
.el-menu {
  height: 100%;
  overflow: hidden;
}

.welcome {
  display: flex;
  font-size: 66px;
  justify-content: center;
  align-items: center;
}
.welcome h5 {
  font-weight: 400;
}
</style>

<script>
export default {
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
      this.$message({
        type: "success",
        message: "已退出登录!",
      });
    },
  },
  created() {
    console.log(this.$route);
  },
};
</script>
