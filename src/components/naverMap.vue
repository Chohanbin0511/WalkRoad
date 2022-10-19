<template>
	<!-- naver map -->
	<div id="map" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import { computed, onMounted, toRefs } from 'vue';

const props = defineProps({
	detailInfo: Object,
});

const { detailInfo } = toRefs(props);

const itemList = computed(() => {
	let result = [
		{
			type: 'begin',
			title: '시작 지점',
			adress: detailInfo.value.beginLnmadr
				? detailInfo.value.beginLnmadr
				: detailInfo.value.beginRdnmadr,
			detailInfo: detailInfo.value.beginSpotNm,
		},
		{
			type: 'end',
			title: '종료 지점',
			adress: detailInfo.value.endLnmadr
				? detailInfo.value.endLnmadr
				: detailInfo.value.endRdnmadr,
			detailInfo: detailInfo.value.endSpotNm,
		},
	];
	return result;
});

let map;

const initMap = () => {
	map = new naver.maps.Map('map', {
		zoom: 10,
		// mapTypeControl: true,
	});
	for (let i = 0; i < itemList.value.length; i++) {
		changePostionText(itemList.value[i]);
	}
};

let infoWindowBegin = new naver.maps.InfoWindow({
	anchorSkew: true,
});
let infoWindowEnd = new naver.maps.InfoWindow({
	anchorSkew: true,
});

const changePostionText = async detail => {
	try {
		const result = await addressSearch(detail);
		createOberlay(result, detail);
	} catch (error) {
		console.error(error);
	}
};

const createOberlay = (response, detail) => {
	let item = response.v2.addresses[0];
	let position = new naver.maps.LatLng(item.y, item.x);
	console.log('position', position);
	if (detail.type === 'begin') {
		infoWindowBegin.setContent(
			[
				'<div style="padding:10px;min-width:200px;">',
				'<h3 style="margin-top:5px;"> ' + detail.title + '</h3>',
				'<h3 style="margin-top:5px;"> ' + detail.detailInfo + '</h3>',
				'<h3 style="margin-top:5px;"> ' + detail.adress + '</h3>',
				'</div>',
			].join('\n'),
		);
		map.setCenter(position);
	} else {
		infoWindowEnd.setContent(
			[
				'<div style="padding:10px;min-width:200px;">',
				'<h3 style="margin-top:5px;"> ' + detail.title + '</h3>',
				'<h3 style="margin-top:5px;"> ' + detail.detailInfo + '</h3>',
				'<h3 style="margin-top:5px;"> ' + detail.adress + '</h3>',
				'</div>',
			].join('\n'),
		);
	}
	let marker = new naver.maps.Marker({
		map: map,
		position: position,
		title: position,
		icon: {
			url: './assets/icons/test_icon.png',
			size: new naver.maps.Size(24, 37),
			anchor: new naver.maps.Point(12, 37),
			origin: new naver.maps.Point(0, 0),
		},
		zIndex: 100,
	});
	naver.maps.Event.addListener(
		marker,
		'click',
		getClickHandler(
			marker,
			detail.type === 'begin' ? infoWindowBegin : infoWindowEnd,
		),
	);
	naver.maps.Event.addListener(map, 'idle', function () {
		updateMarker(map, marker);
	});
};

const addressSearch = item => {
	return new Promise((resolve, reject) => {
		naver.maps.Service.geocode(
			{
				query: item.adress,
			},
			function (status, response) {
				console.log('status', status);
				console.log('response', response);
				if (status === naver.maps.Service.Status.ERROR) {
					if (!item.adress) {
						reject(status);
					}
					reject(status);
				}

				if (response.v2.meta.totalCount === 0) {
					reject(status);
				}

				if (status === 200) {
					resolve(response);
				}
			},
		);
	});
};

const updateMarker = (map, marker) => {
	let mapBounds = map.getBounds();
	console.log('mapBounds', mapBounds);
	let position = marker.getPosition();

	if (mapBounds.hasLatLng(position)) {
		showMarker(map, marker);
	} else {
		hideMarker(map, marker);
	}
};

const showMarker = (map, marker) => {
	if (marker.setMap()) return;
	marker.setMap(map);
};

const hideMarker = (map, marker) => {
	if (!marker.setMap()) return;
	marker.setMap(null);
};

// 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
const getClickHandler = (marker, infoWindow) => {
	return function () {
		if (infoWindow.getMap()) {
			infoWindow.close();
		} else {
			infoWindow.open(map, marker);
		}
	};
};

onMounted(() => {
	initMap();
});
</script>

<style lang="scss" scoped></style>
