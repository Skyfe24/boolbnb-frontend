import { createRouter, createWebHistory } from 'vue-router';

import EstatesList from '@/components/pages/EstatesList.vue';
import EstateDetail from '@/components/pages/EstateDetail.vue';
import NotFoundPage from '@/components/pages/NotFoundPage.vue';
import SearchPage from '@/components/pages/SearchPage.vue';
const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes: [
        { path: '/', name: 'estates', component: EstatesList },
        { path: '/estates/:id', name: 'estate-detail', component: EstateDetail },
        { path: '/SearchPage', name: 'search-page', component: SearchPage },
        
        { path: '/notFoundPage', name: 'notFoundPage', component: NotFoundPage },
        { path: '/:pathMatch(.*)*', redirect: '/notFoundPage' },
        
    ]
});

export { router };