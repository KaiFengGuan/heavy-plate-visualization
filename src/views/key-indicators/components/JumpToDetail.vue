<template>
  <div class="jump-to-detail">
    <a @click="toHeating">加热</a>
    <a @click="toRolling">轧制</a>
    <a @click="toCooling">冷却</a>
  </div>
</template>

<script>
export default {
  name: 'JumpToDetail',
  props: {
    upid: {
      type: String,
      require: true,
    }
  },
  methods: {
    toHeating() {
      console.log('to heating', this.upid)
      this.toProcess('heating');
    },
    toRolling() {
      console.log('to rolling', this.upid)
      this.toProcess('rolling');
    },
    toCooling() {
      console.log('to cooling', this.upid)
      this.toProcess('cooling');
    },
    toProcess(process) {
      this.$router.push({
        path: `/data-overview/${process}-process`,
        query: { upid: this.upid }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.jump-to-detail {
  display: flex;
  justify-content: center;

  a {
    margin-left: 2px;
  }

  &:first-child {
    margin-left: 0;
  }
}
</style>