<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="orderList">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form
            label-position="left"
            label-width="120px"
            class="demo-table-expand"
          >
            <el-form-item label="商品">
              <div
                v-for="item in scope.row.products"
                :key="item._id"
                class="product-item"
              >
                <img alt="" :src="item.productId.image" />
                <div class="product-info">
                  <div>{{ item.productId.name }}</div>
                  <div>￥{{ item.productId.price.toFixed(2) }}</div>
                </div>
                <span>X{{ item.productNum }}</span>
              </div>
            </el-form-item>
            <el-form-item label="收货人地址">{{
              scope.row.consigneeAddress
            }}</el-form-item>
            <el-form-item label="电话">{{ scope.row.telNumber }}</el-form-item>
            <el-form-item label="收货人">{{ scope.row.userName }}</el-form-item>
            <el-form-item label="是否收货">{{
              scope.row.isDelivered ? "已收货" : "未收货"
            }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="orderNum" label="订单编号"> </el-table-column>
      <el-table-column prop="orderPrice" label="订单价格(￥)">
      </el-table-column>
      <el-table-column prop="isPay" label="是否付款">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="!scope.row.isPay">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="delivery" label="是否发货">
        <template slot-scope="scope">
          <el-tag
            type="danger"
            v-if="!scope.row.delivery && scope.row.isPay"
            @click="handleDelivery(scope.row.orderNum)"
            >否</el-tag
          >
          <el-tag type="danger" v-else-if="!scope.row.delivery">否</el-tag>
          <el-tag type="success" v-else>已发货</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.createDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="operation" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="dialogVisible = true"
          ></el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="remove(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
    dateFormat(val) {
      return dayjs(val).format("YYYY-MM-DD hh:mm");
    },
  },
  data() {
    return {
      orderList: [],
      dialogVisible: false,
      paegNum: 1,
      pageSize: 10,
      totalNum: 0,
    };
  },
  methods: {
    handleClose() {},
    // 获取数据
    async fetchCategoryList() {
      const res = await this.$http.get(
        `rest/orders?pageNum=${this.paegNum}&pageSize=${this.pageSize}`
      );
      this.orderList = res.data.model;
      this.totalNum = res.data.totalNum;
    },
    // 删除分类
    async remove(row) {
      this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/orders/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        // 重新获取数据
        this.fetchCategoryList();
      });
    },
    // 是否发货
    handleDelivery(orderNum) {
      this.$confirm("是否发货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.$http.put("delivery", { orderNum });
        this.fetchCategoryList();
        console.log(res);
        this.$message({
          type: "success",
          message: "发货成功!",
        });
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
.product-item {
  display: flex;
  margin-top: 10px;
}

.product-item > span {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  font-size: 18px;
}

.product-item .product-info {
  font-size: 16px;
  align-self: center;
  margin-left: 20px;
}

.product-item img {
  width: 200px;
  height: 150px;
}

.el-tag:hover {
  cursor: pointer;
}
</style>
