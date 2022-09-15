import { user } from './index.js';

/**
 * 진행중
 */
/**
 * 유저 List 조회
 * @returns
 */
export function getUserList() {
	return user.get('');
}

/**
 * 유저 정보 조회
 * @returns
 */
export function getUserDetail(id) {
	return user.get(`/${id}`);
}

/**
 * 유저 확인
 */
export function duplicateUser(body) {
	return user.get(``, body);
}

/**
 * 유저 추가
 */
export function createUser(body) {
	return user.post(``, body);
}

/**
 * 유저 삭제
 */
export function deleteUser(id) {
	return user.delete(`/${id}`);
}

/**
 * 유저의 길 별점 추가
 */
export function createRoadCheckPoint(id, params) {
	return user.post(`/${id}/likeRoad`, params);
}
