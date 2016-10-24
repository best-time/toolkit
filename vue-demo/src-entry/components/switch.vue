<template>

  <div class="page-switch">
    <div class="page-title">Switch</div>

    <div class="page-part page-switch-padding">

      <mt-switch v-model="value1">
        <label v-text="value1"></label>
      </mt-switch>

    </div>
    <br>
    <div class="page-part page-switch-padding">

      <mt-switch v-model="value4">
        <label v-text="value4"></label>
      </mt-switch>

    </div>
<br>

    <mt-cell class="demo-a" :title="'选项 ' + value2">
      <mt-switch v-model="value2"></mt-switch>
    </mt-cell>
    
    <mt-cell class="demo-a" :title="'选项 ' + value3">
      <mt-switch v-model="value3"></mt-switch>
    </mt-cell>

  </div>

</template>

<script>
export default {
  name: 'page-switch',

  data() {
    return {
      value1: false,
      value2: false,
      value3: true,
      value4: true
    };
  }
};
</script>

<style lang="sass">
  .page-switch-padding {
        margin: 0 10px;
      }
      .demo-a {
        padding-right: 30px;
      }
</style>
