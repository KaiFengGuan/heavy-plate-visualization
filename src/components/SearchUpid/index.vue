<template>
  <div class="search-container">
    <el-input
      placeholder="请输入板号"
      prefix-icon="el-icon-search"
      v-model="inputUpid"
      maxlength="11"
      clearable
    >
    </el-input>
    <div class="button">
      <el-button v-if="search" @click="clickSearch">查询</el-button>
      <el-button v-if="analysis" @click="clickAnalysis">分析</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    upid: {
      type: String,
      default: ''
    },
    search: {
      type: Boolean,
      default: true
    },
    analysis: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputUpid: this.upid
    }
  },
  methods: {
    clickSearch() {
      this.$emit('clickSearch', this.inputUpid);
    },
    clickAnalysis() {
      this.$emit('clickAnalysis', this.inputUpid);
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  justify-content: space-between;

  .el-input {
    width: 180px;
    margin-right: 10px;
  }
}
</style>