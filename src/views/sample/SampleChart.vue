<template>
	<TheViewLayout>
		<template #mainPanel>
			<v-container>
				<highcharts :options="chartOptions"></highcharts>
			</v-container>
			<!-- 검색 창-->
		</template>
	</TheViewLayout>
</template>

<script setup>
import TheViewLayout from '@/layouts/TheViewLayout.vue';
import { ref } from 'vue';

const chartOptions = ref({
	chart: {
		options3d: {
			enabled: true,
			alpha: 45,
		},
	},
	plotOptions: {
		pie: {
			innerSize: 100,
			depth: 45,
		},
	},
	series: [
		{
			type: 'pie',
			data: [
				['Norway', 16],
				['Germany', 12],
				['USA', 8],
				['Sweden', 8],
				['Netherlands', 8],
				['ROC', 6],
				['Austria', 7],
				['Canada', 4],
				['Japan', 3],
			],
		},
	],
});
// onMounted(() => {
// 	chartOptions.value = {
// 		series: [{ data: [1, 2, 3] }],
// 	};
// });
</script>

<style lang="scss" scoped></style>
