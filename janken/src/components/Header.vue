<template>
  <div>
    <h1>ジャンケンアプリ</h1>
    <router-link tag="button" to="/" class="router-button">ジャンケン</router-link>
    <router-link tag="button" to="/score" class="router-button">スコア</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.router-button{
    margin: 0 10px;
}
</style>