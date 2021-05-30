<template>
  <div>
    <div class="product-list-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ command ? command : "分类查找"
          }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="清空">
            清空
          </el-dropdown-item>
          <el-dropdown-item
            :command="item"
            v-for="(item, index) in categories"
            :key="index"
            >{{ item }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table :data="selectModel.length === 0 ? model : selectModel">
      <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="categories.name" label="分类">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.categories.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格(元)"></el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="$router.push(`/products/edit/${scope.row._id}`)"
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
      categories: [],
      command: "",
      selectModel: [],
    };
  },
  methods: {
    // 获取数据
    async fetchProductList() {
      const res = await this.$http.get(
        `rest/products?pageNum=${this.paegNum}&pageSize=${this.pageSize}`
      );
      this.model = res.data.model;
      let cateArr = [];
      res.data.model.forEach((v) => {
        if (!cateArr.includes(v.categories.name)) {
          cateArr.push(v.categories.name);
        }
      });
      this.categories = cateArr;
      this.totalNum = res.data.totalNum;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/products/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        // 重新获取数据
        this.fetchProductList();
      });
    },
    handleSizeChange(val) {
      // console.log(val);
      this.pageSize = val;
      this.fetchProductList();
    },
    handleCurrentChange(val) {
      // console.log(val);
      this.paegNum = val;
      this.fetchProductList();
    },
    // 根据分类获取商品
    // async fetchProductByCateId() {
    //   const res = await this.$http.get("rest/products/");
    // },
    handleCommand(command) {
      console.log(command);
      if (command === "清空") {
        this.command = "";
        this.selectModel = [];
      } else {
        this.command = command;
        this.selectModel = this.model.filter(
          (v) => v.categories.name === command
        );
      }
    },
  },
  created() {
    this.fetchProductList();
  },
};
</script>

<style>
.product-list-header {
  display: flex;
  justify-content: space-between;
}
</style>
