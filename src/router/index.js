import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import ActionLibraryView from '../views/ActionLibraryView.vue'
import ActionDetailView from '../views/ActionDetailView.vue'

/**
 * 使用 hash 模式而非 history 模式：
 * 纯静态托管（GitHub Pages / 任意静态目录）下直接刷新子路径不会 404，
 * 添加到桌面后从任意路由启动也不依赖服务端 rewrite 配置。
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '今日训练', tab: 'home' },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: { title: '训练日历', tab: 'calendar' },
    },
    {
      path: '/library',
      name: 'library',
      component: ActionLibraryView,
      meta: { title: '动作库', tab: 'library' },
    },
    {
      path: '/library/:actionId',
      name: 'action-detail',
      component: ActionDetailView,
      meta: { title: '动作详情', tab: 'library' },
    },
    // 兜底：未知路径回首页
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
