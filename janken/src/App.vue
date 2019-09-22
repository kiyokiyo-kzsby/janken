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
    submitValidate(){
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
        this.invalid = false;
        this.invalidMessage = '';
      }
      return !this.invalid;
    },
    submitResults(){
      if(this.submitValidate()){
        this.getResults();
        var rankIn = false;
        if(this.winningPercentage > this.results[9].winningPercentage) rankIn = true;
        else if(this.winningPercentage == this.results[9].winningPercentage && this.winCount > this.results[9].winCount) rankIn = true;
        if(rankIn){
          db.collection('results').doc()
          .set({
            name: this.name,
            winCount: this.winCount,
            loseCount: this.loseCount,
            drawCount: this.drawCount,
            winningPercentage: this.winningPercentage,
            timestamp: new Date
          })
          .then(() => {
            this.resetScore();
            this.name = '';
            this.getResults();
            db.collection('results').doc(this.results[9].id).delete()
          })
        }
      }
    },
    getResults(){
      db.collection('results').orderBy("winningPercentage","desc").orderBy("winCount","desc").orderBy("timestamp").get().then((querySnapshot) => {
        this.results = [];
        var rank = 1;
        querySnapshot.forEach((doc) => {
          if(rank<=10){
            var result = doc.data();
            result.id = doc.id;
            result.rank = rank++;
            this.results.push(result);
          }else{
            db.collection('results').doc(doc.id).delete()
          }
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
