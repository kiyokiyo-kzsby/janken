<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <h1>キング・オブ・ジャンケン</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" offset="4">
            <p>戦績：　{{ winCount }}勝　{{ loseCount }}敗　{{ drawCount }}分け</p>
            <p>勝率 {{ winningPercentage }} %</p>
        </v-col>
        <v-col cols="2">
          <v-btn @click="resetScore">リセット</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset="3">
          <p v-if="invalid" class="error">{{ invalidMessage }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset="3">
          <v-form>
            <v-text-field
              v-model="name"
              label="name"
              required
            >
            </v-text-field>
          </v-form>
        </v-col>
        <v-col cols="2">
          <v-btn @click="submitResults" color='primary' size='medium'>戦績を送信する</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tabs centered v-model="tabNum">
            <v-tab>Janken</v-tab>
            <v-tab>Ranking</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <component :is="components[tabNum]" @updateResult="updateResult" :results="results"></component>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Janken from "./components/Janken";
import Ranking from "./components/Ranking";
import db from './firebaseInit';
import Toasted from 'vue-toasted';

export default {
  components: {
    Header,
    Janken,
    Ranking
  },
  data() {
    return {
      winCount: 0,
      loseCount: 0,
      drawCount: 0,
      name: '',
      invalid: false,
      invalidMessage: '',
      results: [],
      components: ['Janken','Ranking'],
      tabNum: 0
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
        if(this.results.length<10) rankIn = true;
        else{
          if(this.winningPercentage > this.results[9].winningPercentage) rankIn = true;
          else if(this.winningPercentage == this.results[9].winningPercentage && this.winCount > this.results[9].winCount) rankIn = true;
        }
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
            this.$toasted.show('ランクイン！ :)',{
              position: 'bottom-left',
              duration: 3000,
              type: 'success'
            });
            this.resetScore();
            this.name = '';
            this.getResults();
          })
        }else{
          this.$toasted.show('ランク外 :(',{
            position: 'bottom-left',
            duration: 3000,
            type: 'info'
          });
          this.resetScore();
          this.name = '';
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
html{
  text-align: center;
}
</style>
