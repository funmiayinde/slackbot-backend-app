import config from 'config';
import errorHandler from './middleware/errors';
import Q from 'q';
import {NOT_FOUND} from "./utils/codes";
import AppError from './utils/app-error';
import slackBot from './rest/v1/slack-bot/slack-bot.route';

const prefix = config.get('api.prefix');

/**
 * The routes will add all the application defined routes
 * @param {app} app The app is an instance of an express application
 * @return {Promise<void>}
 */
export default async (app) => {
    app.use(prefix, slackBot);

    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use('*', (req, res, next) => {
        return next(new AppError('not found', NOT_FOUND));
    });
    app.use(errorHandler);
    return Q.resolve(app);
};
