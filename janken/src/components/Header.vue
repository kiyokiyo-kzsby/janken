<template>
  <div>
    <v-row>
      <v-col>
        <h1>キング・オブ・ジャンケン</h1>
      </v-col>
    </v-row>
    <v-row>
      <router-link tag="button" to="/" class="router-button">ジャンケン</router-link>
      <router-link tag="button" to="/ranking" class="router-button">ランキング</router-link>
    </v-row>
  </div>
</template>

<script>

</script>

<style scoped>
.router-button{
    margin: 0 10px;
}
</style>