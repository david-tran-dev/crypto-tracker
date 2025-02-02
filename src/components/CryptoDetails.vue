<template>
	<div
		v-if="crypto && chartData"
		class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 max-w-[1000px] mx-auto"
	>
		<div class="flex items-center mb-6">
			<img
				:src="crypto.image.large"
				:alt="crypto.name"
				class="w-16 h-16 mr-4"
			/>
			<div>
				<h2
					class="text-2xl font-semibold text-gray-900 dark:text-gray-100"
				>
					{{ crypto.name }}
				</h2>
				<p class="text-gray-600 dark:text-gray-400">
					{{ crypto.symbol.toUpperCase() }}
				</p>
			</div>
		</div>
		<div class="mb-6">
			<p class="text-xl text-gray-900 dark:text-gray-100">
				Price: ${{ crypto.market_data.current_price.usd.toFixed(2) }}
			</p>
			<p class="text-gray-700 dark:text-gray-300">
				Market Cap: ${{
					crypto.market_data.market_cap.usd.toLocaleString()
				}}
			</p>
			<p>
				24h Change:
				<span
					:class="{
						'text-green-600':
							crypto.market_data.price_change_percentage_24h > 0,
						'text-red-600':
							crypto.market_data.price_change_percentage_24h < 0,
					}"
					>{{
						crypto.market_data.price_change_percentage_24h.toFixed(
							2
						)
					}}%</span
				>
			</p>
		</div>
		<div class="mb-6">
			<h3
				class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100"
			>
				Price Chart (Last 7 Days)
			</h3>

			<LineChart
				:data="chartData"
				:options="chartOptions"
				ref="chartInstance"
			/>
		</div>
	</div>
	<button
		@click="goBack"
		class="block px-4 py-2 mx-auto mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
	>
		Back to List
	</button>
</template>

<script setup lang="ts">
import { ref, computed, watch, onActivated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Line as LineChart } from 'vue-chartjs';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

type CryptoType = {
	id: string;
	name: string;
	symbol: string;
	image: { large: string };
	market_data: {
		current_price: { usd: number };
		market_cap: { usd: number };
		price_change_percentage_24h: number;
	};
};

type ChartDataType = {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		borderColor: string;
		tension: number;
	}[];
};

type ChartInstanceType = {
	options: { responsive: boolean };
	update: () => void;
};

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const route = useRoute();
const router = useRouter();
const crypto = ref<CryptoType | null>(null);
console.log("🚀 ~ crypto:", crypto)
const chartInstance = ref<ChartInstanceType | null>(null);

const chartData = ref<ChartDataType | null>(null);
const chartOptions = computed(() => ({
	responsive: true,
}));

const isDarkMode = computed(() =>
	document.documentElement.classList.contains('dark')
);

const fetchCryptoData = async () => {
  try {
    const [cryptoResponse, chartDataResponse] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/${route.params.id}`
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${route.params.id}/market_chart?vs_currency=usd&days=7`
      ),
    ]);

    crypto.value = await cryptoResponse.json();

    const prices =(await chartDataResponse.json()).prices;
    chartData.value = {
      labels: prices.map((price: string[]) =>
        new Date(price[0]).toLocaleDateString()
      ),
      datasets: [
        {
          label: 'Price (USD)',
          data: prices.map((price: string[]) => price[1]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching crypto details:', error);
  }
};
onActivated(fetchCryptoData);

const goBack = () => {
	router.push({ name: 'CryptoList' });
};

watch(isDarkMode, () => {
	if (chartInstance.value) {
		chartInstance.value.options = chartOptions.value;
		chartInstance.value.update();
	}
});
</script>
