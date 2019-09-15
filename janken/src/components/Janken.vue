<template>
  <div>
    <h1>ジャンケン</h1>
    <div v-if="beforeJanken">
        <h4>コンピュータ</h4>
        <img :src="handImageSrc[srcNum]" class="hand-image">
        <h4>あなた</h4>
        <img src="@/assets/janken-rock.png" alt="グー" class="hand-image" @click="janken(1)">
        <img src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image" @click="janken(2)">
        <img src="@/assets/janken-paper.png" alt="パー" class="hand-image" @click="janken(3)">
    </div>
    <div v-else>
        <button @click="restart">もう１回</button>
        <h3>{{ resultMessage }}</h3>
        <h4>コンピュータ</h4>
        <img v-if="computerHand===1" src="@/assets/janken-rock.png" alt="グー" class="hand-image">
        <img v-else-if="computerHand===2" src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image">
        <img v-else src="@/assets/janken-paper.png" alt="パー" class="hand-image">
        <br>
        <h4>あなた</h4>
        <img v-if="userHand===1" src="@/assets/janken-rock.png" alt="グー" class="hand-image">
        <img v-else-if="userHand===2" src="@/assets/janken-scissors.png" alt="チョキ" class="hand-image">
        <img v-else src="@/assets/janken-paper.png" alt="パー" class="hand-image">
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
            handImageSrc: [
                require('../assets/janken-rock.png'),
                require('../assets/janken-scissors.png'),
                require('../assets/janken-paper.png')
            ],
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
</style>