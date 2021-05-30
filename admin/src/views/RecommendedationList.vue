<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页推荐</el-breadcrumb-item>
      <el-breadcrumb-item>首页推荐列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="recommendedation">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col
              v-for="(item1, index) in scope.row.recommendedation"
              :key="index"
              :md="24"
            >
              <h1>{{ item1.name }}</h1>
              <div class="card-content">
                <el-card
                  class="card-item"
                  :body-style="{ padding: '0px' }"
                  v-for="(item2, index2) in item1.items"
                  :key="index2"
                >
                  <img :src="item2.image" class="image" />
                  <div style="padding: 14px;align-self: flex-end">
                    <span>{{ item2.productName }}</span>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="_id" label="ID" width="360"> </el-table-column>
      <el-table-column prop="name" label="模块名称">
        <template slot-scope="scope">
          <el-tag
            v-for="(item, index) in scope.row.recommendedation"
            :key="index"
            >{{ item.name }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="recommendedation" label="模块数">
        <template slot-scope="scope">
          {{ scope.row.recommendedation.length }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="address" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="$router.push(`/recommendedation/edit/${scope.row._id}`)"
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
      recommendedation: [],
    };
  },
  methods: {
    async fetchRecommendedation() {
      const res = await this.$http.get("rest/recommendedations");
      this.recommendedation = res.data.model;
      console.log(res.data);
    },
  },
  created() {
    this.fetchRecommendedation();
  },
};
</script>

<style scoped>
.card-content .card-item {
  width: 20%;
  margin-right: 20px;
}
img {
  width: 100%;
}
.card-content {
  display: flex;
}

.el-col h1 {
  margin: 10px 0 15px 0;
}

.el-tag {
  margin-right: 5px;
}
</style>
