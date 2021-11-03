import '@babel/polyfill';
import config from 'config';
import http from 'http';
import loadRoutes from './routing';
// import initBot from './bot.js';
import intiDatabase from './setup/database';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Q from 'q';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({}));
app.set('port', config.get('app.port'));

export default intiDatabase()
    // .then(() => initBot())
    .then(() => loadRoutes(app))
    .then(async (app) => {
        const server = await http.createServer(app)
            .listen(config.get('app.port'));
        console.log(`\n
	\tApplication listening on ${config.get('app.baseUrl')}\n
	\tEnvironment => ${config.util.getEnv('NODE_ENV')}: ${server}\n
	\tDate: ${new Date()}`);
        return Q.resolve(app);
    }, err => {
        console.log('There was an un catch error');
        console.error(err);
    });
