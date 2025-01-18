import { createRouter, createWebHistory } from 'vue-router';
import CryptoList from '../components/CryptoList.vue';
import CryptoDetails from '../components/CryptoDetails.vue';

const routes = [
	{
		path: '/',
		name: 'CryptoList',
		component: CryptoList,
	},
	{
		path: '/crypto/:id',
		name: 'CryptoDetails',
		component: CryptoDetails,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
