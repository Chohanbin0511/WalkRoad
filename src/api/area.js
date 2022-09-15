import { areaList } from './index.js';

/**
 * 지역 List 조회
 * @returns
 */
export function getAreaList() {
	return areaList.get('');
}

/**
 * 지역 칼럼추가
 */
export function createArea(body) {
	return areaList.post(``, body);
}
