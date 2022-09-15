<template>
	<v-card v-resize="onResize" :style="`height:${innerHeight}px;`">
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

						<template v-slot:subtitle> {{ userInfo.userId }} </template>

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
				<v-container>
					<h1>List</h1>
				</v-container>
				<!-- 검색 창-->
				<v-container>
					<v-row>
						<v-col cols="11">
							<v-combobox
								v-model="selectedArea"
								:items="inputAreaList"
								label="위치 선택"
								multiple
								chips
							>
								<template v-slot:selection="data">
									<v-chip
										:key="JSON.stringify(data.item)"
										v-bind="data.attrs"
										:input-value="data.selected"
										:disabled="data.disabled"
										@click:close="data.parent.selectItem(data.item)"
									>
										<v-avatar class="accent white--text" left></v-avatar>
										{{ data.item }}
									</v-chip>
								</template>
							</v-combobox>
						</v-col>
						<v-col cols="1">
							<v-btn
								rounded="lg"
								color="primary"
								size="large"
								@click="searchList"
							>
								검색
							</v-btn>
						</v-col>
					</v-row>
				</v-container>
				<!-- 총 개수 -->
				<v-container>
					<div>총 개수 : {{ recordTotal }}</div>
				</v-container>

				<!-- Table List -->
				<v-container>
					<v-table density="compact">
						<thead>
							<tr>
								<th class="text-left">길명</th>
								<!-- <th class="text-left">stretIntrcn:길소개</th> -->
								<th class="text-left">총길이</th>
								<th class="text-left">총소요시간</th>
								<th class="text-left">시작지점명</th>
								<!-- <th class="text-left">beginRdnmadr:시작지점도로명주소</th> -->
								<!-- <th class="text-left">beginLnmadr:시작지점소재지지번주소</th> -->
								<th class="text-left">종료지점명</th>
								<!-- <th class="text-left">endRdnmadr:종료지점소재지도로명주소</th> -->
								<!-- <th class="text-left">endLnmadr:종료지점소재지지번주소</th> -->
								<!-- <th class="text-left">coursInfo:경로정보</th> -->
								<!-- <th class="text-left">관리기관전화번호</th> -->
								<!-- <th class="text-left">institutionNm:관리기관명</th> -->
								<!-- <th class="text-left">데이터기준일자</th> -->
								<th class="text-left">제공기관</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="item in recordList"
								:key="item.name"
								@click="roadRecordDetail(item)"
							>
								<td>{{ item.stretNm }}</td>
								<!-- <td>{{ item.stretIntrcn }}</td> -->
								<td>{{ item.stretLt }}</td>
								<td>{{ item.reqreTime }}</td>
								<td>{{ item.beginSpotNm }}</td>
								<!-- <td>{{ item.beginRdnmadr }}</td>
					<td>{{ item.beginLnmadr }}</td> -->
								<td>{{ item.endSpotNm }}</td>
								<!-- <td>{{ item.endRdnmadr }}</td>
					<td>{{ item.endLnmadr }}</td>
					<td>{{ item.coursInfo }}</td> -->
								<!-- <td>{{ item.phoneNumber }}</td> -->
								<!-- <td>{{ item.institutionNm }}</td> -->
								<!-- <td>{{ item.referenceDate }}</td> -->
								<td>{{ item.insttName }}</td>
							</tr>
						</tbody>
					</v-table>
				</v-container>
				<v-container>
					<div class="text-center">
						<v-pagination
							v-model="params._page"
							:length="Math.ceil(recordTotal / params._limit)"
							:total-visible="7"
						></v-pagination>
					</div> </v-container
			></v-main>
		</v-layout>
	</v-card>

	<v-row justify="center">
		<v-dialog v-model="dialog">
			<v-card class="mx-auto" width="600px">
				<v-img
					src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
					height="200px"
					cover
				></v-img>
				<v-card-title> {{ detailInfo.stretNm }} </v-card-title>
				<!-- Course Info -->
				<v-card-subtitle>
					Contact Info :
					{{ detailInfo.phoneNumber + ' / ' + detailInfo.insttName }}
				</v-card-subtitle>
				<v-card-subtitle>
					Updated Date :
					{{ detailInfo.referenceDate }}
				</v-card-subtitle>
				<br />
				<v-card-text>
					<h3>Course Info</h3>
					<br />
					Walking Time : {{ detailInfo.reqreTime }} <br />
					Distance : {{ detailInfo.stretLt }} km
				</v-card-text>
				<v-card-text>
					<h3>Content</h3>
					<br />
					{{ detailInfo.stretIntrcn }}
				</v-card-text>
				<v-card-actions>
					<v-btn color="orange-lighten-2" variant="text" @click="show = !show">
						More
					</v-btn>

					<v-spacer></v-spacer>

					<v-btn
						:icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						@click="show = !show"
					></v-btn>
				</v-card-actions>

				<!-- Detail popup -->
				<v-expand-transition>
					<div v-show="show">
						<v-divider></v-divider>
						<v-card-text>
							<div class="font-weight-bold ml-1 mb-2">Detail Course</div>

							<v-timeline>
								<v-timeline-item
									v-for="message in detailCoursInfo"
									:key="message"
									:dot-color="message.color"
									size="x-small"
								>
									<div
										v-if="
											message.num === 1 ||
											message.num === detailCoursInfo.length
										"
									>
										{{ message.num === 1 ? 'Start Course' : 'End Course' }}
									</div>
									<div v-else>{{ message.num }} Course</div>
									<div class="font-weight-normal">
										<strong>{{ message.place }}</strong>
									</div>
									<div
										v-if="
											message.num === 1 ||
											message.num === detailCoursInfo.length
										"
									>
										{{
											message.num === 1
												? detailInfo.beginLnmadr
												: detailInfo.endLnmadr
										}}
									</div>
								</v-timeline-item>
							</v-timeline>
						</v-card-text>
					</div>
				</v-expand-transition>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green-darken-1" text @click="closeRecordDetail">
						close
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getRoadRecordsList } from '@/api/common.js';
import { getAreaList } from '@/api/area.js';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
/**
 * 유저 정보
 */
const userInfo = useAuthStore().userInfo;

const show = ref(false);
const selectedArea = ref([]);
const inputAreaList = ref([]);
const dialog = ref(false);
const params = ref({
	// stretNm
	// stretIntrcn
	// stretLt
	// reqreTime
	// beginSpotNm
	// beginRdnmadr
	// beginLnmadr
	// endSpotNm
	// endRdnmadr
	// endLnmadr
	// coursInfo
	// phoneNumber
	// institutionNm
	// referenceDate
	// latitude
	// longitude
	// insttCode
	// insttName
	// insttName_like: '^경기도 부',
	_page: 1,
	_limit: 10,
	insttName: null,
	// stretNm: '남명조식선비길',
	// id: 1187,
});
const recordList = ref([]);
const fetchRoadRecordsList = async () => {
	try {
		const { data } = await getRoadRecordsList(params.value);
		recordList.value = data;
		console.log('dd');
	} catch (error) {
		console.error(error);
	}
};

fetchRoadRecordsList();

// Total 구하기
const recordTotal = ref(0);
const fetchRoadRecordTotal = async () => {
	const param = {
		insttName: params.value.insttName,
	};
	try {
		const { data } = await getRoadRecordsList(param);
		recordTotal.value = data.length;
		console.log('data', data.length);
	} catch (error) {
		console.error(error);
	}
};

// 상세보기
const detailInfo = ref({});
const detailCoursInfo = ref([]);
const roadRecordDetail = item => {
	detailCoursInfo.value = [];
	dialog.value = true;
	detailInfo.value = item;
	item.coursInfo.split('-').forEach((el, idx) => {
		detailCoursInfo.value[idx] = {
			place: el,
			color: idx % 2 === 1 ? 'deep-purple lighten-1' : 'green',
			num: idx + 1,
		};
	});
	console.log('click', item);
	console.log('detailCoursInfo', detailCoursInfo.value);
};

const closeRecordDetail = () => {
	dialog.value = false;
	show.value = false;
};

const fetchAreaList = async () => {
	try {
		const { data } = await getAreaList();
		inputAreaList.value = data;
	} catch (error) {
		console.error(error);
	}
};

const searchList = () => {
	console.log('selectedArea', selectedArea.value);
	params.value._page = 1;
	params.value.insttName = selectedArea.value;
	fetchRoadRecordTotal();
	fetchRoadRecordsList();
};

const innerHeight = ref(0);
onMounted(() => {
	fetchAreaList();
	fetchRoadRecordTotal();
	console.log('tete', window.innerHeight);
	innerHeight.value = window.innerHeight;
});

/**
 * 페이지 변경시 RecordList 조회
 */
watch(
	() => params.value,
	newValue => {
		console.log('new', newValue);
		if (newValue) {
			params.value = newValue;
			fetchRoadRecordsList();
		} else {
			return;
		}
	},
	{ deep: true },
);

const items = ref([
	{
		icon: 'mdi-inbox',
		title: 'List',
		value: 'list',
		url: '/',
	},
	{
		icon: 'mdi-star',
		title: 'Q&A',
		value: 'qna',
		url: '/test',
	},
	{
		icon: 'mdi-send',
		title: 'Notice',
		value: 'notice',
		url: '/',
	},
	{
		icon: 'mdi-email-open',
		title: 'myInfo',
		value: 'myInfo',
		url: '/',
	},
]);
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
	location.href =
		'https://kauth.kakao.com/oauth/logout?client_id=36e5387cc0f77924d56d106a8075e5d7&logout_redirect_uri=http://127.0.0.1:5173/login';
};

// screen resize
const onResize = () => {
	innerHeight.value = window.innerHeight;
};
</script>

<style lang="scss" scoped></style>
