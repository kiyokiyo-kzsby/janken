<template>
  <div>
    <Header></Header>
    <p>戦績：　{{ winCount }}勝　{{ loseCount }}敗　{{ drawCount }}分け　<button @click="resetScore">リセット</button></p>
    <p>勝率 {{ winningPercentage }} %</p>
    <p v-if="invalid" class="error">{{ invalidMessage }}</p>
    <input type="text" placeholder="name" v-model="name">
    <button @click="submitResults">戦績を送信する</button>
    <router-view @updateResult="updateResult"></router-view>
  </div>
</template>

<script>
import Header from "./components/Header";
import {combinations,pow} from "mathjs"

export default {
  components: {
    Header
  },
  data() {
    return {
      winCount: 0,
      loseCount: 0,
      drawCount: 0,
      name: '',
      invalid: false,
      invalidMessage: ''
    }
  },
  computed: {
    winningPercentage(){
      if(this.winCount==0) return 0;
      else{
        return this.winCount / (this.winCount + this.loseCount + this.drawCount) * 100;
      }
    }
  },
  methods: {
    resetScore(){
      this.winCount = 0;
      this.loseCount = 0;
      this.drawCount = 0;
    },
    updateResult(resultMessage){
      if(resultMessage=='勝ち') this.winCount++;
      else if(resultMessage=='負け') this.loseCount++;
      else this.drawCount++;
    },
    submitResults(){
      if(this.name==''){
        this.invalid = true;
        this.invalidMessage = '名前を入力してください'
      }else{
        this.winCount = 0;
        this.loseCount = 0;
        this.drawCount = 0;
        this.invalid = false;
        this.name = '';
      }
    }
  }
};
</script>

<style>
html {
  text-align: center;
}

.error{
  color: red;
}
</style>
