import { createRouter, createWebHashHistory } from 'vue-router'
import frame from '@/views/main/frame.vue'
import map from '@/views/multdata/map.vue'
import login from '@/views/login/login.vue'
import makemap from '@/views/makemap/heatmap.vue'
import basemap from '@/components/basemap.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Frame',
      component: frame,
      children: [
        { path: '', name: 'Map', component: map },
        { path: 'heatmap',name:'HeatMap', component: makemap},
        { path: 'basemap', name: 'Basemap', component: basemap}
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
