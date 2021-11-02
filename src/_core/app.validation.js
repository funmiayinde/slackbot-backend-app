import Validator from 'validatorjs';

/**
 * The App Validation class
 */
class AppValidation {
	/**
     * @param {Object} obj The object to validate
     * @return {Object} Validator
     */
	create(obj) {
		const rules = {};
		const validator = new Validator(obj, rules);
		return {
			errors: validator.errors.all(),
			passed: validator.passes()
		};
	}
	/**
     * @param {Object} obj The object to validate
     * @return {Object} Validator
     */
	update(obj) {
		const rules = {};
		const validator = new Validator(obj, rules);
		return {
			errors: validator.errors.all(),
			passed: validator.passes()
		};
	}
}

export default AppValidation;
