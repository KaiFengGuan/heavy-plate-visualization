<template>
  <div class="analysis" @click="jumpTo">_&gt;</div>
</template>

<script>
export default {
  name: 'JumpToAnalysis',
  props: {
    upid: {
      type: String,
      require: true
    }
  },
  methods: {
    jumpTo() {
      console.log('will analy plate: ', this.upid)
    }
  }
}
</script>

<style lang="scss" scoped>
.analysis {
  cursor: pointer;
  color: blue;
}
</style>
