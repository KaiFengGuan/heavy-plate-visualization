<template>
  <div class="shape-container">
    <div
      v-for="(item, index) in fault"
      :key="`${upid}_fault${index}`"
      class="fault-item"
      :class="{ fault: item === 0 }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "PlateShape",
  props: {
    fault: {
      type: Array,
      require: true,
    },
    upid: {
      type: String,
      require: true,
    },
  },
  mounted() {
    // console.log(this.fault);
    // console.log(typeof this.fault, typeof this.fault[0]);
  },
};
</script>

<style lang="scss" scoped>
.shape-container {
  display: flex;
  justify-content: center;

  .fault-item {
    width: 15px;
    height: 15px;
    margin-left: 5px;
    border-radius: 50%;
    background-color: blue;

    & + .fault {
      background-color: red;
    }
  }

  & :first-child {
    margin-left: 0;
  }
}
</style>
