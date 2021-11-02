import AppValidation from "../../../_core/app.validation";
import Validator from "validatorjs";


export default class SlackBotValidation extends AppValidation {

    /**
     * @param {Object} body The object to validate
     * @return {Object} Validator
     * */
    async create(body) {
        const rules = {};
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        };
    }

    /**
     * @param {Object} body The object to validate
     * @return {Object} Validator
     * */
    async update(body) {
        const rules = {};
        const validator = new Validator(body, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes()
        };
    }
}
