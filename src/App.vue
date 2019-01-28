<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  /* scoped: 使style中的代码只对当前组件生效 */
  #app {
    height: 100%
  }
</style>
