<template>
  <div class="welcome">
    <p>Welcome!</p>
    <p>{{username }}</p>
  </div>
</template>
<script>
  export default{
    data(){
      console.log(this.username)
      return {
        username:this.username
      }
    },
    inject:['username']
  }
</script>
<style lang="less" scoped>
.welcome{
  font-size: 35px;
}
.welcome :last-child{
  color: red;
}
</style>>