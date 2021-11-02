import QueryParser from '../utils/query-parser';
import AppError from '../utils/app-error';
import {BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK} from '../utils/codes';
import _ from 'lodash';
import Pagination from '../utils/pagination';
import lang from '../lang/index';

/**
 * The App controller class
 * */
class AppController {
    /**
     * @param {Model} model The default model object
     * for the controller. Will he required to create
     * an instance of the controller
     * */
    constructor(model) {
        if (new.target === AppController) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
        if (model) {
            this.model = model;
            this.lang = lang.get(model.collection.collectionName);
        }
        this.id = this.id.bind(this);
        this.create = this.create.bind(this);
        this.findOne = this.findOne.bind(this);
        this.find = this.find.bind(this);
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @param {String} id The id from the url parameter
     * @return {Object} res The response object
     */
    async id(req, res, next, id) {
        try {
            let object = await this.model.findOne({_id: id, deleted: false}).exec();
            if (object) {
                req.object = object;
                return next();
            }
            const appError = new AppError(this.lang.not_found, NOT_FOUND);
            return next(appError);
        } catch (e) {
            return next(e);
        }
    }


    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async findOne(req, res, next) {
        let object = req.object;
        console.log('object:', object);
        req.response = {
            model: this.model,
            code: OK,
            value: object
        };
        return next();
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async create(req, res, next) {
        try {
            const processor = this.model.getProcessor(this.model);
            const obj = await processor.prepareBodyObject(req);
            const validate = await this.model.getValidator().create(obj);
            if (!validate.passed) {
                const appError = new AppError(lang.get('error').inputs, BAD_REQUEST, validate.errors);
                return next(appError);
            }
            let checkError = await processor.validateCreate(obj);
            if (checkError) {
                return next(checkError);
            }
            let object = await processor.getExistingResource(this.model, obj);
            if (object) {
                if (object && this.model.returnDuplicate) {
                    req.response = {
                        message: this.lang.created,
                        model: this.model,
                        code: CREATED,
                        value: object
                    };
                    return next();
                }

                if (this.model.overrideExisting) {
                    object = await processor.updateObject(object, obj);
                    req.response = {
                        model: this.model,
                        code: OK,
                        message: this.lang.updated,
                        value: await object.save()
                    };
                    return next();
                }
                const messageObj = this.model.uniques.map(m => ({[m]: `${m.replace('_', ' ')} must be unique`}));
                return next(new AppError(lang.get('error').resource_already_exist, CONFLICT, messageObj));
            }
            obj.accountId = req.accountId;
            object = await processor.createNewObject(obj);
            req.response = {
                message: this.lang.created,
                model: this.model,
                code: CREATED,
                value: await object
            };
            const postCreate = await processor.postCreateResponse(object, obj);
            if (postCreate) {
                req.response = Object.assign({}, req.response, postCreate);
            }
            return next();
        } catch (err) {
            return next(err);
        }
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {Function} next The callback to the next program handler
     * @return {Object} The response object
     */
    async find(req, res, next) {
        const queryParser = new QueryParser(Object.assign({}, req.query));
        const pagination = new Pagination(req.originalUrl);
        const processor = this.model.getProcessor(this.model);
        try {
            const {value, count} = await processor.buildModelQueryObject(pagination, queryParser);
            req.response = {
                model: this.model,
                code: OK,
                value,
                count,
                queryParser,
                pagination
            };
            return next();
        } catch (err) {
            return next(err);
        }
    }

}

export default AppController;
