<template>
  <el-table :data="model">
    <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
    <el-table-column prop="username" label="用户名"> </el-table-column>
    <el-table-column fixed="right" prop="address" label="操作" width="240">
      <template slot-scope="scope">
        <el-button
          size="small"
          type="primary"
          @click="$router.push(`/admin_users/edit/${scope.row._id}`)"
          >编辑</el-button
        >
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
    async fetchAdminUsersList() {
      const res = await this.$http.get("rest/admin_users");
      this.model = res.data.model;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/admin_users/${row._id}`);
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
    this.fetchAdminUsersList();
  },
};
</script>
