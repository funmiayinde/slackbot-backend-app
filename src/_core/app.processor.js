import _ from 'lodash';
import AppResponse from '../utils/app-response';
import {DELETE} from '../utils/codes';
import {slugifyText} from '../utils/helper';


/**
 * The app processor class
 * */
export default class AppProcessor {
    /**
     * @param {Model} model The default model object
     * for the controller. Will be required to create
     * an instance of the controller
     * */
    constructor(model) {
        this.model = model;
    }

    /**
     * @param {Object} obj required for response
     * @return {Object}
     * */
    async validateCreate(obj) {
        return null;
    }

    /**
     * @param {Object} object required for response
     * @param {Object} payload required for response
     * @return {Object}
     * */
    async postCreateResponse(object, payload = {}) {
        return false;
    }
    /**
     * @param {Object} options required for response
     * @param {Object} model
     * @param {Object} value
     * @param {Object} code
     * @param {Object} message
     * @param {Object} queryParser
     * @param {Object} pagination
     * @param {Object} count
     * @param {Object} token
     * @param {Object} email
     * @param {Object} virtuals
     * @return {Promise<Object>}
     */
    async getApiClientResponse({model, value, code, message, queryParser, pagination, count, token, email, virtuals = {}}) {
        const meta = AppResponse.getSuccessMeta();
        if (token) {
            meta.token = token;
        }
        _.extend(meta, {status_code: code});
        if (message) {
            meta.message = message;
        }
        if (queryParser && queryParser.population) {
            value = await model.populate(value, queryParser.population);
        }
        if (pagination && !queryParser.getAll) {
            pagination.totalCount = count;
            if (pagination.morePages(count)) {
                pagination.next = pagination.current + 1;
            }
            meta.pagination = pagination.done();
        }
        if (_.isArray(value)) {
            value = value.map(v => ({..._.omit(v, ...model.hiddenFields), ...virtuals}));
        } else {
            try {
                console.log('hidden-fields:', model.hiddenFields);
                value = {..._.omit(value, ...model.hiddenFields), ...virtuals};
                console.log('value:', value);
            } catch (e) {
                console.log(e);
            }
        }
        return AppResponse.format(meta, value);
    }

    /**
     * @param {Object} pagination The pagination for object
     * @param {Object} queryParser The query parser

     * @return {Object}
     * */
    async buildModelQueryObject(pagination, queryParser) {
        console.log('queryParser : ', queryParser.filters);
        let query = this.model.find(queryParser.query);
        if (!queryParser.getAll) {
            query = query.skip(pagination.skip)
                .limit(pagination.perPage);
        }
        query = query.sort(
            (pagination && pagination.sort) ? Object.assign(pagination.sort, {createdAt: -1}) : '-createAt');

        return {
            value: await query.select(queryParser.selection).exec(),
            count: await this.model.countDocuments(queryParser.query).exec()
        };
    }

    /**
     * @param {Object} obj The payload object
     * @return {Object}
     * */
    async createNewObject(obj) {
        const toFill = this.model.fillables;
        if (toFill && toFill.length > 0) {
            obj = _.pick(obj, ...toFill);
        }
        return new this.model(obj).save();
    }

    /**
     * @param {Object} req The request object
     * @return {Promise<Object>}
     */
    async prepareBodyObject(req) {
        let obj = Object.assign({}, req.params, req.query, req.body);
        if (req.authId) {
            const user = req.authId;
            obj = Object.assign(obj, {user, owner: user, created_by: user}, req.body);
        }
        if (req.accountId) {
            obj = Object.assign(obj, {account: req.accountId});
        }
        if (this.model.slugify) {
            const value = this.model.slugify;
            obj = Object.assign(obj, {slug: slugifyText(req.body[value].toLowerCase())});
        }
        return obj;
    }

    /**
     * @param {Object} model The model object
     * @param {Object} obj The request object
     * @return {Promise<Object>}
     */
    async getExistingResource(model, obj) {
        console.log('uniques:', model.uniques.length);
        if (model.uniques.length > 0) {
            const uniqueKeys = model.uniques;
            const query = {'$and': []};
            for (const key of uniqueKeys) {
                query['$and'].push({[key]: _.get(obj, key)});
            }
            console.log('query:', query);
            return model.findOne({...query});
        }
        return null;
    }
}
