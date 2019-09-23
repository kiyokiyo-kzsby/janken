<template>
  <div>
    <div v-if="beforeJanken">
        <h1>ジャンケン</h1>
        <h4>コンピュータ</h4>
        <img src="@/assets/janken-rock.png" alt="グー" class="hand-image" v-show="srcNum==0">
        <img src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image" v-show="srcNum==1">
        <img src="@/assets/janken-paper.png" alt="パー" class="hand-image" v-show="srcNum==2">
        <h4>あなた</h4>
        <img src="@/assets/janken-rock.png" alt="グー" class="hand-image" @click="janken(1)">
        <img src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image" @click="janken(2)">
        <img src="@/assets/janken-paper.png" alt="パー" class="hand-image" @click="janken(3)">
    </div>
    <div v-else>
        <h1>{{ resultMessage }}</h1>
        <h4>コンピュータ</h4>
        <img v-if="computerHand===1" src="@/assets/janken-rock.png" alt="グー" class="hand-image">
        <img v-else-if="computerHand===2" src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image">
        <img v-else src="@/assets/janken-paper.png" alt="パー" class="hand-image">
        <br>
        <h4>あなた</h4>
        <img v-if="userHand===1" src="@/assets/janken-rock.png" alt="グー" class="hand-image">
        <img v-else-if="userHand===2" src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image">
        <img v-else src="@/assets/janken-paper.png" alt="パー" class="hand-image">
        <br>
        <v-btn @click="restart" color="primary">もう１回</v-btn>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            beforeJanken: true,
            userHand: 0,
            computerHand: 0,
            resultMessage: '',
            srcNum: 0
        }
    },
    created(){
        this.start();
    },
    methods: {
        janken(userHand){
            this.userHand = userHand;
            this.computerHand = Math.floor(Math.random()*3+1);
            var num = this.userHand - this.computerHand + 3;
            if(num%3==0) this.resultMessage = '引き分け';
            else if(num%3==1) this.resultMessage = '負け';
            else this.resultMessage = '勝ち';
            this.beforeJanken = false;
            this.$emit('updateResult',this.resultMessage);
            this.stop();
        },
        start(){
            this.timer = setInterval(() => {
                this.srcNum = (this.srcNum+1)%3;
            }, 100)
        },
        stop(){
            clearInterval(this.timer);
        },
        restart(){
            this.beforeJanken = true;
            this.start();
        }
    }
};
</script>

<style scoped>
.hand-image{
    display: inline-block;
    height: 100px;
    margin: 0 20px;
}

@media screen and (max-width:600px) {
.hand-image{
    display: inline-block;
    height: 72px;
    margin: 0 12px;
}
}
</style>