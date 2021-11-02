import {OK} from './codes';

/**
 * The AppResponse class
 * */
class AppResponse {
	/**
     * @return {Object} The success response object
     * */
	static getSuccessMeta() {
		return {status_code: OK, success: true};
	}

	/**
     * @param {Object} meta The meta object
     * @param {Object} data success response object
     * @return {Object} The success response object
     * */
	static format(meta, data = null) {
		let response = {};
		response._meta = meta;
		if (meta.code) {
			meta.status_code = meta.code;
			delete meta.code;
		}
		if (data) {
			response.data = data;
		}
		return response;
	}
}

export default AppResponse;
