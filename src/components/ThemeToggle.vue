<template>
	<button
		@click="toggleTheme"
		class="fixed p-2 text-gray-800 bg-gray-200 rounded-full top-4 right-4 dark:bg-gray-700 dark:text-gray-200"
		aria-label="Toggle theme"
	>
		<svg
			v-if="isDark"
			xmlns="http://www.w3.org/2000/svg"
			class="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			class="w-6 h-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	</button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
	isDark.value = !isDark.value;
	updateTheme();
};

const updateTheme = () => {
	if (isDark.value) {
		document.documentElement.classList.add('dark');
		localStorage.setItem('theme', 'dark');
	} else {
		document.documentElement.classList.remove('dark');
		localStorage.setItem('theme', 'light');
	}
};

onMounted(() => {
	const savedTheme = localStorage.getItem('theme');
	isDark.value =
		savedTheme === 'dark' ||
		(!savedTheme &&
			window.matchMedia('(prefers-color-scheme: dark)').matches);
	updateTheme();
});

watch(isDark, updateTheme);
</script>
