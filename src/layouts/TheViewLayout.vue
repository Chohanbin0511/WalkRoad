<template>
	<v-card v-resize="onResize" :style="`height:${100}%;`">
		<v-layout style="height: 100%">
			<v-app-bar color="primary" density="compact">
				<template v-slot:prepend>
					<v-app-bar-nav-icon
						@click.stop="drawer = !drawer"
					></v-app-bar-nav-icon>
				</template>
				<v-app-bar-title>길</v-app-bar-title>

				<v-btn rounded="lg" color="white" size="large" @click="userLoginCheck">
					{{ userInfo.isLogined ? '로그아웃 ' : '로그인' }}
				</v-btn>
			</v-app-bar>

			<v-navigation-drawer v-model="drawer" bottom temporary>
				<v-list density="compact">
					<v-card width="400" class="mt-4 mb-4">
						<template v-slot:title> Profile </template>

						<template v-slot:subtitle>
							<v-icon> mdi-account-outline </v-icon>
							{{ userInfo.userId }}
						</template>

						<template v-slot:text> {{ userInfo.nickname }} </template>
					</v-card>
					<v-list-item
						v-for="(item, i) in items"
						:key="i"
						:value="item.value"
						active-color="primary"
						@click="routeUrlChange(item.url)"
					>
						<template v-slot:prepend>
							<v-icon :icon="item.icon"></v-icon>
							<v-list-item-title>{{ item.title }}</v-list-item-title>
						</template>
					</v-list-item>
				</v-list>
			</v-navigation-drawer>

			<v-main>
				<slot name="mainPanel" />
			</v-main>
		</v-layout>
	</v-card>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
/**
 * 유저 정보
 */
const userInfo = useAuthStore().userInfo;
const { proxy } = getCurrentInstance();
// screen height
const innerHeight = ref(0);
onMounted(() => {
	innerHeight.value = window.innerHeight;
});
// screen resize
const onResize = () => {
	innerHeight.value = window.innerHeight;
};

// 메뉴클릭시 이동
const routeUrlChange = url => {
	console.log('url', url);
	router.push(url);
};

const drawer = ref(false);
const group = ref(null);
watch(
	() => group.value,
	() => {
		drawer.value = false;
	},
	{ deep: true },
);

// 로그인 여부에 따라 로그인, 로그아웃 처리

const store = useAuthStore();
const { CLEAR_SESSION } = store;
const userLoginCheck = () => {
	if (userInfo.isLogined) {
		CLEAR_SESSION();
		logout();
	} else {
		router.push('/login');
	}
};
// 로그아웃 url 이동
const logout = () => {
	location.href = `https://kauth.kakao.com/oauth/logout?client_id=${proxy.restApiKey}&logout_redirect_uri=${proxy.redirectUri}`;
};

const items = ref([
	{
		icon: 'mdi-walk',
		title: 'Walk-List',
		value: 'list',
		url: '/',
	},
	// {
	// 	icon: 'mdi-alarm',
	// 	title: 'Q&A',
	// 	value: 'qna',
	// 	url: '/updateNote',
	// },
	// {
	// 	icon: 'mdi-bulletin-board',
	// 	title: 'Notice',
	// 	value: 'notice',
	// 	url: '/updateNote',
	// },
	{
		icon: 'mdi-update',
		title: 'UpdateInfo',
		value: 'updateInfo',
		url: '/updateNote',
	},
]);
</script>

<style lang="scss" scoped></style>
