import { walkRoadRecords, paramsSerializer } from './index.js';

/**
 * Road Records List 조회
 * @returns
 */
export function getRoadRecordsList(params) {
	return walkRoadRecords.get(`?${paramsSerializer(params)}`);
}

/**
 * 상세조회
 */
export function getRoadRecordDetail(record) {
	return walkRoadRecords.get(`?${paramsSerializer(record)}`);
}

/**
 * 칼럼추가
 */
export function patchRoadRecord(body) {
	return walkRoadRecords.post(``, body);
}
