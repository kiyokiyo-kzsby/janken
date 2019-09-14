<template>
  <div>
    <h1>ジャンケン</h1>
    <img src="@/assets/janken-rock.png" alt="グー" class="user-hand-image">
    <img src="@/assets/janken-scissors.png" alt="チョキ" class="user-hand-image">
    <img src="@/assets/janken-paper.png" alt="パー" class="user-hand-image">
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.user-hand-image{
    display: inline-block;
    width: 100px;
    margin: 0 20px;
}
</style>