<template>
	<div
		class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
	>
		<div class="container mx-auto px-4 py-8">
			<h1 class="text-4xl font-bold mb-8 text-center">Crypto Tracker</h1>
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</router-view>
		</div>
		<ThemeToggle />
	</div>
</template>

<script setup>
import ThemeToggle from './components/ThemeToggle.vue';
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
