import { createRouter, createWebHashHistory } from 'vue-router'
import frame from '@/views/main/frame.vue'
import map from '@/views/multdata/map.vue'
import login from '@/views/login/login.vue'
import makemap from '@/views/makemap/heatmap.vue'
// import basemap from '@/components/basemap.vue'
import main from '@/views/travel/main.vue'
import doc from '@/views/travel/doc.vue'
import track from '@/views/travel/track.vue'
import user from '@/views/travel/user.vue'
import world from '@/views/travel/world.vue'
import favorites from '@/views/travel/favorites.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Frame',
      component: frame,
      children: [
        { path: '', name: 'Map', component: map },
        { path: 'heatmap', name: 'HeatMap', component: makemap },
        { path: 'main', name: 'Main', component: main },
        { path: 'doc', name: 'Doc', component: doc },
        { path: 'track', name: 'Track', component: track },
        { path: 'user', name: 'User', component: user },
        { path: 'world', name: 'World', component: world },
        { path: 'favorites', name: 'Favorites', component: favorites}

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
