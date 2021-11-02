require('dotenv').config();
const PORT = process.env.PORT || 3000;
console.log('port', PORT);
module.exports = {
    app: {
        appName: process.env.APP_NAME || 'slackbot-backend-api',
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    },
    databases: {
        url: process.env.DB_URL,
        test: process.env.DB_TEST_URL
    },
    api: {
        lang: 'en',
        prefix: '^/api/v[1-9]',
        versions: [1],
        patch_version: '1.0.0',
        pagination: {
            itemsPerPage: 10
        },
    },
    slack: {
        credentials: {
            apiKey: process.env.GOOGLE_API_KEY,
            provider: process.env.GOOGLE_AS_PROVIDER,
        }
    }
};
