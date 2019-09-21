<template>
  <div>
    <Header></Header>
    <p>戦績：　{{ winCount }}勝　{{ loseCount }}敗　{{ drawCount }}分け　<button @click="resetScore">リセット</button></p>
    <p>勝率 {{ winningPercentage }} %</p>
    <p v-if="invalid" class="error">{{ invalidMessage }}</p>
    <input type="text" placeholder="name" v-model="name">
    <button @click="submitResults">戦績を送信する</button>
    <keep-alive>
      <router-view @updateResult="updateResult" :results="results"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from "./components/Header";
import db from './firebaseInit'

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
      invalidMessage: '',
      results: []
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
  created(){
    this.getResults();
  },
  methods: {
    resetScore(){
      this.winCount = 0;
      this.loseCount = 0;
      this.drawCount = 0;
      this.invalid = false;
    },
    updateResult(resultMessage){
      if(resultMessage=='勝ち') this.winCount++;
      else if(resultMessage=='負け') this.loseCount++;
      else this.drawCount++;
    },
    submitResults(){
      if(this.winCount+this.loseCount+this.drawCount==0){
        this.invalid = true;
        this.invalidMessage = '戦績がありません'
      }else if(this.name==''){
        this.invalid = true;
        this.invalidMessage = '名前を入力してください'
      }else if(this.name.length>10){
        this.invalid = true;
        this.invalidMessage = '名前は10文字以下にしてください'
      }else{
        db.collection('results').doc().set({
          name: this.name,
          winCount: this.winCount,
          loseCount: this.loseCount,
          drawCount: this.drawCount,
          winningPercentage: this.winningPercentage,
          timestamp: new Date
        }).then(response => {
          this.resetScore();
          this.invalid = false;
          this.name = '';
          this.getResults();
        })
      }
    },
    getResults(){
      db.collection('results').orderBy("winningPercentage","desc").limit(10).get().then((querySnapshot) => {
        this.results = [];
        querySnapshot.forEach((doc) => {
          var result = doc.data();
          result.id = doc.id;
          this.results.push(result);
          console.log(result);
        });
      });
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
