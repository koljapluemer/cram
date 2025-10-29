import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../pages/home/HomePage.vue')
const PracticePage = () => import('../pages/practice/PracticePage.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/practice/:situationId',
      name: 'practice',
      component: PracticePage,
      props: (route) => ({
        situationId: Number(route.params.situationId),
        targetLang: route.query.target ?? '',
        nativeLang: route.query.native ?? '',
        languageName: route.query.languageName ?? '',
        situationTitle: route.query.situationTitle ?? '',
      }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
