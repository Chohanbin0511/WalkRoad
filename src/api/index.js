import axios from 'axios';

function createInstance(url) {
	const instance = axios.create({
		baseURL: `${import.meta.env.VITE_APP_API_URL}${url}`,
	});
	return instance;
}

export const paramsSerializer = function (paramObj) {
	const params = new URLSearchParams();
	for (const key in paramObj) {
		if (typeof paramObj[key] === 'object') {
			for (let i in paramObj[key]) {
				params.append(key, paramObj[key][i]);
			}
		} else {
			params.append(key, paramObj[key]);
		}
	}
	return params.toString();
};

export const walkRoadRecords = createInstance('/records');
export const areaList = createInstance('/areaList');
export const user = createInstance('/user');
