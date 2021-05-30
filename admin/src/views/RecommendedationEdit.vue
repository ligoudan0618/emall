<template>
  <div class="app">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页推荐商品</el-breadcrumb-item>
      <el-breadcrumb-item>{{ id ? "编辑" : "新建" }}推荐</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>{{ id ? "编辑" : "新建" }}推荐列表</h1>
    <el-form label-width="120px" @submit.native.prevent>
      <el-button size="small" @click="model.push({ name: '', items: [] })"
        ><i class="el-icon-plus"></i>添加推荐模块</el-button
      >
      <!-- 模块行 -->
      <el-row type="flex" style="flex-wrap: wrap">
        <el-col
          :md="24"
          v-for="(item, index1) in model"
          :key="index1"
          class="row-item"
        >
          <el-button type="primary" size="small" @click="item.items.push({})"
            ><i class="el-icon-plus"></i>添加商品</el-button
          >
          <el-button size="small" type="danger" @click="model.splice(index1, 1)"
            ><i class="el-icon-delete"></i>删除该模块</el-button
          >
          <el-form-item label="模块名">
            <el-input v-model="item.name"></el-input>
          </el-form-item>
          <!-- 模块的子项 -->
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col
              :md="12"
              v-for="(item2, index2) in item.items"
              :key="index2"
            >
              <el-form-item label="商品名">
                <el-select
                  v-model="item2.productId"
                  @change="handleSelectChange($event, index1, index2)"
                >
                  <el-option
                    v-for="item3 in products"
                    :key="item3._id"
                    :label="item3.name"
                    :value="item3._id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 商品图片 -->
              <el-form-item v-if="model[index1].items[index2].image">
                <img
                  :src="model[index1].items[index2].image"
                  alt=""
                  class="productImg"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="danger"
                  @click="model[index1].items.splice(index2, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="save"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {},
  },
  data() {
    return {
      model: [],
      products: [],
    };
  },
  methods: {
    async save() {
      //   console.log("success");
      if (this.id) {
        await this.$http.put(`rest/recommendedations/${this.id}`, {
          recommendedation: this.model,
        });
      } else {
        await this.$http.post("rest/recommendedations", {
          recommendedation: this.model,
        });
      }
      this.$router.push("/recommendedation/list");
      this.$message({
        type: "success",
        message: "保存成功!",
      });
      //   console.log(res.data);
    },
    // 获取商品
    async fetchProducts() {
      const res = await this.$http.get("rest/products");
      //   console.log(res.data);
      this.products = res.data.model;
    },
    // 选择器值改变时触发
    handleSelectChange(e, index1, index2) {
      const index = this.products.findIndex((v) => v._id === e);
      console.log(e, index1, index2, index);
      this.model[index1].items[index2].image = this.products[index].image;
      this.model[index1].items[index2].productName = this.products[index].name;
    },
    async fetchRecommendedationById() {
      const res = await this.$http.get(`rest/recommendedations/${this.id}`);
      console.log(res.data);
      this.model = res.data.recommendedation;
    },
  },
  created() {
    this.fetchProducts();
    this.id && this.fetchRecommendedationById();
  },
};
</script>

<style>
.el-button {
  margin: 10px 0;
}

.productImg {
  width: 178px;
  height: 178px;
  display: block;
}

.row-item {
  border-top: 1px solid #666;
}
</style>
