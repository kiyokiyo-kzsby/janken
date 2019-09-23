<template>
  <div>
    <v-row>
      <v-col>
        <h1>ランキング</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dark height="300px" fixed-header>
          <thead>
            <tr>
              <th>順位</th>
              <th>名前</th>
              <th>勝率</th>
              <th>勝ち数</th>
              <th>負け数</th>
              <th>引分け数</th>
              <th class="hidden-xs-only">日時</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" :key="result.id">
              <td>{{result.rank}}</td>
              <td>{{result.name}}</td>
              <td>{{result.winningPercentage|round}}%</td>
              <td>{{result.winCount}}</td>
              <td>{{result.loseCount}}</td>
              <td>{{result.drawCount}}</td>
              <td class="hidden-xs-only">{{result.timestamp.seconds|formatDate}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ['results'],
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
</style>