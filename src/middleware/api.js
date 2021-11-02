import {UNAUTHORIZED} from "../utils/codes";
import AppError from "../utils/app-error";
import config from 'config';

export default async (req, res, next) => {
    let apiKey = req.query.api_key || req.headers['x-api-key'];
    if (!apiKey) {
        return next(new AppError('Api Key absent', UNAUTHORIZED));
    }
    if (apiKey) {
        // check header or url parameters or post parameters for the token
        // decode token
        if (apiKey !== config.get('app.api_key')) {
            return next(new AppError('Invalid Api Key', UNAUTHORIZED,));
        }
    }
    return next();
};
