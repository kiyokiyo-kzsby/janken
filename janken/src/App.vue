<template>
  <div>
    <Header></Header>
    <p>戦績：　{{ winCount }}勝　{{ loseCount }}敗　{{ drawCount }}分け</p>
    <p>p値 {{ (upperProbability+lowerProbability)/2*100 }} %</p>
    <input type="text" placeholder="name" v-bind="name">
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
      name: ''
    }
  },
  computed: {
    upperProbability(){
      var res = 0;
      for(var i=this.winCount+1;i<=this.winCount+this.loseCount;i++){
        res += combinations(this.winCount+this.loseCount,i)*pow((1/2),this.winCount+this.loseCount);
      }
      return res;
    },
    lowerProbability(){
      var res = this.upperProbability;
      res += combinations(this.winCount+this.loseCount,this.winCount)*pow((1/2),this.winCount+this.loseCount);
      return res;
    }
  },
  methods: {
    updateResult(resultMessage){
      if(resultMessage=='勝ち') this.winCount++;
      else if(resultMessage=='負け') this.loseCount++;
      else this.drawCount++;
    },
    submitResults(){

    }
  }
};
</script>

<style>
html {
  text-align: center;
}
</style>
