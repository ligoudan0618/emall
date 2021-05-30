<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="model">
      <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
      <el-table-column prop="name" label="分类名称">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parent.name" label="上级分类">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.parent">{{
            scope.row.parent.name
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="$router.push(`/categories/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paegNum"
        :page-sizes="[5, 10, 15, 20, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: [],
      paegNum: 1,
      pageSize: 10,
      totalNum: 0,
    };
  },
  methods: {
    // 获取数据
    async fetchCategoryList() {
      const res = await this.$http.get(
        `rest/categories?pageNum=${this.paegNum}&pageSize=${this.pageSize}`
      );
      this.model = res.data.model;
      this.totalNum = res.data.totalNum;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/categories/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        // 重新获取数据
        this.fetchCategoryList();
      });
    },
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.fetchCategoryList();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.paegNum = val;
      this.fetchCategoryList();
    },
  },
  created() {
    this.fetchCategoryList();
  },
};
</script>

<style>
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-left: -100px;
}
</style>
