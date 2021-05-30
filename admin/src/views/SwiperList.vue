<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="model">
      <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="items.length" label="内容数量"></el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="$router.push(`/swipers/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
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
    async fetchCategoryList() {
      const res = await this.$http.get("rest/swipers");
      this.model = res.data.model;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/swipers/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        // 重新获取数据
        this.fetchCategoryList();
      });
    },
  },
  created() {
    this.fetchCategoryList();
  },
};
</script>
