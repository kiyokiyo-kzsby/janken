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
        <td>{{result.winningPercentage}}</td>
        <td>{{result.winCount}}</td>
        <td>{{result.loseCount}}</td>
        <td>{{result.drawCount}}</td>
        <td>{{new Date( result.timestamp.seconds * 1000 )}}</td>
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
  }
};
</script>

<style scoped>
table{
  display: inline-block;
}
</style>