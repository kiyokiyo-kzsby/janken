<template>
  <div>
    <h1>ランキング</h1>
    <table border=true>
      <tr>
        <th>名前</th>
        <th>勝率</th>
        <th>勝ち数</th>
        <th>負け数</th>
        <th>引分け数</th>
        <th>日時</th>
      </tr>
      <tr v-for="result in results" :key="result.timestamp">
        <td>{{result.name}}</td>
        <td>{{result.winningPercentage|round}}%</td>
        <td>{{result.winCount}}</td>
        <td>{{result.loseCount}}</td>
        <td>{{result.drawCount}}</td>
        <td>{{result.timestamp.seconds|formatDate}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import db from '../firebaseInit';

export default {
  data(){
    return {
      results: []
    }
  },
  created(){
    db.collection('results').orderBy("winningPercentage","desc").limit(10).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.results.push(doc.data())
      });
    });
  },
  filters: {
    formatDate(sec){
      var date = new Date(sec*1000);
      var y = ('000' + date.getFullYear()).slice(-4);
      var m = ('0' + date.getMonth()).slice(-2);
      var d = ('0' + date.getDate()).slice(-2);
      var H = ('0' + date.getHours()).slice(-2);
      var M = ('0' + date.getMinutes()).slice(-2);
      var S = ('0' + date.getSeconds()).slice(-2);
      return y + '/' + m + '/' + d + ' ' + H + ':' +  M + ':' + S;
    },
    round(num){
      return Math.round(num*100)/100;
    }
  }
};
</script>

<style scoped>
table{
  display: inline-block;
}
</style>