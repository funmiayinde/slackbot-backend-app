import mongoose from 'mongoose';
import Q from 'q';
import log from '../utils/logger';
import config from 'config';

export default () => {
    mongoose.Promise = Q.Promise;
    mongoose.connection.on('disconnected', function () {
        log.debug('Mongoose connection to mongodb shell disconnected');
    });

    let databaseUrl = config.get('databases.url');
    if (process.env.NODE_ENV === 'test') {
        databaseUrl = config.get('databases.test');
    }
    return mongoose
        .connect(databaseUrl, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            log.debug(`Database loaded - url - ${databaseUrl}`);
        }, err => {
            log.error(err);
            throw err;
        })
}
