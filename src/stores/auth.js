import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		userInfo: {
			isLogined: false,
			userId: null,
			nickname: null,
			token: null,
			refreshToken: null,
		},
	}),
	actions: {
		SET_LOGIN(loginData) {
			this.userInfo.isLogined = true;
			this.userInfo.userId = loginData.userId;
			this.userInfo.nickname = loginData.nickname;
			this.userInfo.token = loginData.token;
			this.userInfo.refreshToken = loginData.refreshToken;
		},
		CLEAR_SESSION() {
			this.userInfo.isLogined = false;
			this.userInfo.userId = null;
			this.userInfo.nickname = null;
			this.userInfo.token = null;
			this.userInfo.refreshToken = null;
		},
	},
	persist: {
		enabled: true,
	},
});
