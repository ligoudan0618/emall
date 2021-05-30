<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="model">
      <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
      <el-table-column prop="product.name" label="商品名称"> </el-table-column>
      <el-table-column prop="description" label="评论">
        <template slot-scope="scope">
          <!-- <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.description"
            placement="left-start"
          >
            <el-button>{{ scope.row.description }}</el-button>
          </el-tooltip> -->
          <el-popover
            placement="top-start"
            title="评论"
            width="200"
            trigger="hover"
            :content="scope.row.description"
          >
            <el-button class="tip-btn" slot="reference">{{
              scope.row.description
            }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="评论日期">
        <template slot-scope="scope">
          {{ scope.row.createdAt | date }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="$router.push(`/reviews/edit/${scope.row._id}`)"
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
import dayjs from "dayjs";
export default {
  filters: {
    date(val) {
      return dayjs(val).format("YYYY-MM-DD hh:mm");
    },
  },

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
    async fetchReviewList() {
      const res = await this.$http.get(
        `rest/reviews?pageNum=${this.paegNum}&pageSize=${this.pageSize}`
      );
      this.model = res.data.model;
      this.totalNum = res.data.totalNum;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/reviews/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        // 重新获取数据
        this.fetchReviewList();
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
    this.fetchReviewList();
  },
};
</script>

<style>
.cell {
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

.cell .tip-btn {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  text-align: left;
  padding: 0;
  border: none;
}
</style>
