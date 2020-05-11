import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Setting from '@/views/Setting.vue';
import Sandbox from '@/views/Sandbox.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/view/:id',
    name: 'View',
    component: About,
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
  },
  {
    path: '/sandbox',
    name: 'Sandbox',
    component: Sandbox,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
