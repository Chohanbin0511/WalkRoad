<template>
	<v-container v-if="!outhQueryString" class="align-center h-100">
		<div class="py-4 align-end">
			<div class="text-center" style="height: 250px"></div>
			<v-card
				class="text-center mx-auto pa-12 pb-8"
				elevation="8"
				max-width="448"
				rounded="lg"
			>
				<h2 class="mx-auto mb-8 align-center">간편 로그인</h2>

				<a v-on:click="kakaoLoginBtn">
					<!-- <img
						src="https://kauth.kakao.com/public/widget/login/kr/kr_02_medium.png"
						style="cursor: pointer"
				/> -->
					<img :src="kakaoLoginImg" style="width: 200px; cursor: pointer" />
				</a>
				<!-- <a>
					<img :src="naverLoginImg" style="width: 200px; cursor: pointer" />
				</a>
				<div id="naverIdLogin"></div> -->
			</v-card>
		</div>
	</v-container>
	<!-- 공통 loading으로 검토중 -->
	<v-container v-else style="height: 600px; margin-top: 150px">
		<v-row class="fill-height" align-content="center" justify="center">
			<v-col class="text-subtitle-1 text-center" cols="12">
				잠시만 기다려 주세요.
			</v-col>
			<v-col cols="6">
				<v-progress-linear
					color="deep-purple accent-4"
					indeterminate
					rounded
					height="6"
				></v-progress-linear>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { getUserDetail, createUser } from '@/api/user.js';
// import { naverService } from '@/api/naver.js';

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const outhQueryString = ref(route.query.code);
const kakaoLoginBtn = () => {
	// window.Kakao.init(proxy.javaScriptKey); // Kakao Developers에서 요약 정보 -> JavaScript 키
	// SDK 초기화 여부를 판단합니다.
	console.log('sdk 초기화 여부', window.Kakao.isInitialized());
	console.log('Auth', window.Kakao.Auth);

	const params = {
		redirectUri: proxy.redirectUri,
	};
	window.Kakao.Auth.authorize(params);
};

/**
 * 해당 인증코드로 토큰 요청
 */
const kakaoHeader = {
	Authorization: proxy.adminKey,
	'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
};
const getKakaoToken = async () => {
	const store = useAuthStore();
	const { SET_LOGIN } = store;
	console.log('loginWithKakao');
	try {
		const data = {
			grant_type: 'authorization_code',
			client_id: proxy.restApiKey,
			redirect_uri: proxy.redirectUri,
			code: outhQueryString.value,
		};
		const queryString = Object.keys(data)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
			.join('&');
		const tokenResult = await axios.post(
			'https://kauth.kakao.com/oauth/token',
			queryString,
			{ headers: kakaoHeader },
		);
		console.log('카카오 토큰', tokenResult);
		if (tokenResult.status === 200) {
			const userHeader = {
				Authorization: `${tokenResult.data.token_type} ${tokenResult.data.access_token}`,
				'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			};
			const userInfoResult = await axios.get(
				'https://kapi.kakao.com/v2/user/me',
				{
					headers: userHeader,
				},
			);
			console.log('userInfoResult', userInfoResult);
			if (userInfoResult.status === 200) {
				try {
					// DB에 ID check 하고 있으면 로그인 없으면 회원가입 처리
					const result = await getUserDetail(userInfoResult.data.id);
					console.log('userData', result);
					if (result.status === 200) {
						let loginData = {
							userId: result.data.id,
							nickname: result.data.nickname,
							token: tokenResult.data.access_token,
							refreshToken: tokenResult.data.refresh_token,
						};
						SET_LOGIN(loginData);
						router.push('/');
					}
				} catch (e) {
					// 없으면 생성
					const createBody = {
						id: userInfoResult.data.id,
						likeRoad: [],
						gender: userInfoResult.data.kakao_account.gender,
						nickname: userInfoResult.data.properties.nickname,
					};
					const result = await createUser(createBody);
					console.log('userCreate', result);
					// 유저 조회하고 값 return
				}
			}
		}
	} catch (e) {
		console.error(e);
	}
};

const kakaoLoginImg = ref();
// const naverLoginImg = ref();

onMounted(async () => {
	kakaoLoginImg.value = (
		await import(/* @vite-ignore */ '@/assets/img/kakao_login_btn.png')
	).default;
	// naverLoginImg.value = (
	// 	await import(/* @vite-ignore */ '@/assets/img/naver_login_btn.png')
	// ).default;

	// naverService().setNaver();
	if (outhQueryString.value) {
		getKakaoToken();
	}
});
</script>

<style lang="scss" scoped></style>
