<template>
	<v-app>
		<v-main>
			<TheView />
		</v-main>
	</v-app>
</template>

<script setup>
import TheView from '@/layouts/TheView.vue';
import { useAuthStore } from '@/stores/auth';
useAuthStore();
</script>
<style scoped></style>
