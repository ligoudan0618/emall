<template>
  <div class="app">
    <h1>{{ id ? "编辑" : "新建" }}评论</h1>
    <el-form label-width="120px" @submit.native.prevent>
      <el-form-item label="商品">
        <el-select v-model="review.product">
          <el-option
            v-for="item in products"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评论">
        <el-input v-model="review.description"></el-input>
      </el-form-item>
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
      review: {},
      products: [],
    };
  },
  methods: {
    // 新建分类
    async save() {
      if (this.id) {
        await this.$http.put(`rest/reviews/${this.id}`, this.review);
      } else {
        await this.$http.post("rest/reviews", this.review);
      }
      this.$router.push("/reviews/list");
      this.$message({
        type: "success",
        message: "保存成功!",
      });
    },
    // 根据 id 获取评论
    async fetch() {
      const res = await this.$http.get(`rest/reviews/${this.id}`);
      // console.log(res);
      this.review = res.data;
    },
    // 获取商品
    async fetchProduct() {
      const res = await this.$http.get("rest/products");
      this.products = res.data;
    },
  },
  created() {
    this.fetchProduct();
    this.id && this.fetch();
  },
};
</script>
