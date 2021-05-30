<template>
  <el-table :data="model">
    <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
    <el-table-column prop="avatarUrl" label="头像">
      <template slot-scope="scope">
        <img :src="scope.row.avatarUrl" alt="" />
      </template>
    </el-table-column>
    <el-table-column prop="nickName" label="用户名"> </el-table-column>
    <el-table-column prop="mobile" label="手机号码"> </el-table-column>
    <el-table-column prop="email" label="邮箱地址"> </el-table-column>
    <el-table-column fixed="right" prop="address" label="操作" width="240">
      <template slot-scope="scope">
        <el-button size="small" type="danger" @click="remove(scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      model: [],
    };
  },
  methods: {
    // 获取数据
    async fetchUsersList() {
      const res = await this.$http.get("rest/users");
      this.model = res.data.model;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/users/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        // 重新获取数据
        this.fetchAdminUsersList();
      });
    },
  },
  created() {
    this.fetchUsersList();
  },
};
</script>

<style scoped>
img {
  width: 40px;
  height: 40px;
}
</style>
