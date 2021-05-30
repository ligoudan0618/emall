<template>
  <div class="app">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品</el-breadcrumb-item>
      <el-breadcrumb-item>{{ id ? "编辑" : "新建" }}商品</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>{{ id ? "编辑" : "新建" }}商品</h1>
    <el-form label-width="120px" @submit.native.prevent>
      <el-tabs>
        <el-tab-pane label="基础信息">
          <el-form-item label="分类">
            <!-- <el-select v-model="product.categories">
              <el-option
                v-for="item in categories"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select> -->
            <el-cascader
              v-model="product.categories"
              :options="categories"
              :show-all-levels="false"
              :props="{
                expandTrigger: 'hover',
                label: 'name',
                value: '_id',
                emitPath: false,
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="product.name"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="product.price"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              class="avatar-uploader"
              :action="mixinUploadURL"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="afterUpload"
            >
              <img v-if="product.image" :src="product.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="product.description" type="textarea"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品详情">
          <vue-editor
            v-model="product.detail"
            useCustomImageHandler
            @image-added="handleImageAdded"
          ></vue-editor>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          @click="save"
          style="margin-top: 10px"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor,
  },
  props: {
    id: {},
  },
  data() {
    return {
      product: {},
      categories: [],
    };
  },
  methods: {
    // 图片上传成功
    afterUpload(res) {
      this.$set(this.product, "image", res.url);
    },
    // 修改富文本编辑器图片上传的路径
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    // 新建/编辑商品
    async save() {
      if (this.id) {
        await this.$http.put(`rest/products/${this.id}`, this.product);
        // console.log(this.$route);
        // console.log(this.$router);
      } else {
        await this.$http.post("rest/products", this.product);
      }
      this.$router.push("/products/list");
      this.$message({
        type: "success",
        message: "保存成功!",
      });
    },

    async fetch() {
      const res = await this.$http.get(`rest/products/${this.id}`);
      this.product = res.data;
    },

    async fetchCategories() {
      const res = await this.$http.get("rest/categories");
      let categories = res.data.model;
      categories.forEach((item) => {
        if (!item.parent) this.categories.push(item);
      });
      // console.log(categories);
      categories
        .filter((val) => val.parent)
        .forEach((item1) => {
          this.categories.forEach((item2) => {
            if (item2._id === item1.parent._id) {
              if (!item2.children) {
                item2.children = [];
                item2.children.push({
                  name: item1.name,
                  _id: item1._id,
                });
              } else {
                item2.children.push({
                  name: item1.name,
                  _id: item1._id,
                });
              }
            }
          });
        });
    },
  },
  created() {
    this.fetchCategories();
    this.id && this.fetch();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
