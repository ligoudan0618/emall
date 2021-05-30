<template>
  <div class="app">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图</el-breadcrumb-item>
      <el-breadcrumb-item>{{ id ? "编辑" : "新建" }}轮播图</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>{{ id ? "编辑" : "新建" }}轮播图</h1>
    <el-form label-width="120px" @submit.native.prevent>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="轮播图">
        <el-button size="small" @click="model.items.push({})"
          ><i class="el-icon-plus"></i>添加轮播图</el-button
        >
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="24" v-for="(item, index) in model.items" :key="index">
            <!--  -->

            <el-form-item label="商品名">
              <el-select v-model="item.product">
                <el-option
                  v-for="item2 in products"
                  :key="item2._id"
                  :label="item2.name"
                  :value="item2._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片" style="margin-top: .5rem">
              <!-- icon属性原先没定义 要用显示 赋值 -->
              <el-upload
                class="avatar-uploader"
                :action="mixinUploadURL"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="(res) => $set(item, 'img', res.url)"
              >
                <img v-if="item.img" :src="item.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="danger"
                @click="model.items.splice(index, 1)"
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
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
      model: {
        name: "",
        items: [],
      },
      products: [],
    };
  },
  methods: {
    // 新建分类
    async save() {
      if (this.id) {
        await this.$http.put(`rest/swipers/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/swipers", this.model);
      }
      this.$router.push("/swipers/list");
      this.$message({
        type: "success",
        message: "保存成功!",
      });
    },

    async fetch() {
      const res = await this.$http.get(`rest/swipers/${this.id}`);
      this.model = res.data;
    },

    async fetchProduct() {
      const res = await this.$http.get("rest/products");
      // this.parents = res.data.filter((item) => !item.parent);
      this.products = res.data.model;
    },
  },
  created() {
    this.fetchProduct();
    this.id && this.fetch();
  },
};
</script>
