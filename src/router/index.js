import { createRouter, createWebHashHistory } from 'vue-router'
import frame from '@/views/main/frame.vue'
import map from '@/views/map/map.vue'
import login from '@/views/login/login.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Frame',
      component: frame,
      children: [
        { path: '', name: 'Map', component: map }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    }
  ],
})

export default router
