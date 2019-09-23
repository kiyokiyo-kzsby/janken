<template>
  <v-app>
    <v-container>
      <v-row justify="center">
        <v-col>
          <h1>キング・オブ・ジャンケン</h1>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="4">
            <p>
              <span class="hidden-xs-only">戦績： </span>
              <span>{{ winCount }}勝 {{ loseCount }}敗 {{ drawCount }}分け</span>
            </p>
            <p>勝率 {{ winningPercentage | round}} %</p>
        </v-col>
        <v-col cols="2">
          <v-btn @click="resetScore" :disabled="!validScore">リセット</v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="4">
          <v-form v-model="validName">
            <v-text-field
              v-model="name"
              label="name"
              required
              :rules="nameRules"
              :counter="10"
            >
            </v-text-field>
          </v-form>
        </v-col>
        <v-col cols="2">
          <v-btn @click="submitResults" color='primary' size='medium' :disabled="!(validName&&validScore)">
            <span class="hidden-xs-only">戦績を</span>
            <span>送信</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col>
          <v-tabs centered v-model="tabNum">
            <v-tab>Janken</v-tab>
            <v-tab>Ranking</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <component :is="components[tabNum]" @updateResult="updateResult" :results="results"></component>
    </v-container>
  </v-app>
</template>

<script>
import Janken from "./components/Janken";
import Ranking from "./components/Ranking";
import db from './firebaseInit';
import Toasted from 'vue-toasted';

export default {
  components: {
    Janken,
    Ranking
  },
  data() {
    return {
      winCount: 0,
      loseCount: 0,
      drawCount: 0,
      name: '',
      results: [],
      components: ['Janken','Ranking'],
      tabNum: 0,
      isMobile: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
        v => !(/ |　/).test(v) || "You can't use space"
      ],
      validName: false
    }
  },
  computed: {
    winningPercentage(){
      if(this.winCount==0) return 0;
      else{
        return this.winCount / (this.winCount + this.loseCount + this.drawCount) * 100;
      }
    },
    validScore(){
      return this.winCount+this.loseCount+this.drawCount>0
    }
  },
  created(){
    this.getResults();
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  filters: {
    round(num){
      return Math.round(num*100)/100;
    }
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
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
    submitValidate(){
      return this.validName&&this.validScore;
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
              duration: 5000,
              type: 'success'
            });
            this.resetScore();
            this.getResults();
          })
        }else{
          this.$toasted.show('ランク外 :(',{
            position: 'bottom-left',
            duration: 5000,
            type: 'info'
          });
          this.resetScore();
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

@media screen and (max-width:600px) {
h1{
  font-size: 24px;
}
}
</style>
