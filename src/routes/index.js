import { createRouter, createWebHistory } from 'vue-router';

const otherRoutes = [
	{
		path: '/',
		name: 'Home',
		meta: { anonymous: true },
		component: () => import('@/views/MainView.vue'),
		// beforeEnter: to => {
		// return isTokenExpire(false, to);
		// },
	},
	{
		path: '/login',
		name: 'Login',
		meta: { anonymous: true },
		component: () => import('@/views/user/LoginView.vue'),
	},
	{
		path: '/updateNote',
		name: 'UpdateNote',
		meta: { anonymous: true },
		component: () => import('@/views/projectInfo/ProjectUpdateView.vue'),
	},
];

let allRoutes = [];
allRoutes = allRoutes.concat(otherRoutes);

const routes = allRoutes;

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
