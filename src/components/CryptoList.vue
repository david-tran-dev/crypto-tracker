<template>
	<div>
		<ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<li
				v-for="crypto in cryptos"
				:key="crypto.id"
				@click="goToCryptoDetails(crypto.id)"
				class="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-800 hover:shadow-lg"
			>
				<div class="flex items-center mb-4">
					<img
						:src="crypto.image"
						:alt="crypto.name"
						class="w-12 h-12 mr-4"
					/>
					<div>
						<h2
							class="text-xl font-semibold text-gray-900 dark:text-gray-100"
						>
							{{ crypto.name }}
						</h2>
						<p class="text-gray-600 dark:text-gray-400">
							{{ crypto.symbol.toUpperCase() }}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Price
						</p>
						<p class="font-medium text-gray-900 dark:text-gray-100">
							${{ crypto.current_price.toFixed(2) }}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							24h Change
						</p>
						<p
							:class="{
								'text-green-600':
									crypto.price_change_percentage_24h > 0,
								'text-red-600':
									crypto.price_change_percentage_24h < 0,
							}"
						>
							{{ crypto.price_change_percentage_24h.toFixed(2) }}%
							<span v-if="crypto.price_change_percentage_24h > 0"
								>↑</span
							>
							<span v-else>↓</span>
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Market Cap
						</p>
						<p class="font-medium text-gray-900 dark:text-gray-100">
							${{ formatNumber(crypto.market_cap) }}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							24h Volume
						</p>
						<p class="font-medium text-gray-900 dark:text-gray-100">
							${{ formatNumber(crypto.total_volume) }}
						</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
type CryptoType = {
	id: string;
	name: string;
	symbol: string;
	image: string;
	current_price: number;
	price_change_percentage_24h: number;
	market_cap: number;
	total_volume: number;
};
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const cryptos = ref<CryptoType[]>([]);
const router = useRouter();

const fetchCryptos = async () => {
	try {
	
		const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
		cryptos.value = await response.json();
	} catch (error) {
		console.error('Error fetching crypto data:', error);
	}
};

onMounted(fetchCryptos);

const goToCryptoDetails = (id: string) => {
	router.push({ name: 'CryptoDetails', params: { id } });
};

const formatNumber = (num: number): string => {
	if (num >= 1e9) {
		return (num / 1e9).toFixed(2) + 'B';
	}
	if (num >= 1e6) {
		return (num / 1e6).toFixed(2) + 'M';
	}
	if (num >= 1e3) {
		return (num / 1e3).toFixed(2) + 'K';
	}
	return num.toFixed(2);
};
</script>
