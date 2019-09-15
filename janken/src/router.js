import Vue from 'vue';
import Router from 'vue-router';
import Janken from './components/Janken';
import Ranking from './components/Ranking';

Vue.use(Router);

export default new Router({
    routes: [
        {path : '/ranking' , component : Ranking},
        {path : '/*' , component : Janken}
    ]
})