require('dotenv').config();
const PORT = process.env.PORT || 3000;
console.log('port', PORT);
module.exports = {
    app: {
        appName: process.env.APP_NAME || 'slackbot-backend-api',
        baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
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
        user_token: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
        signing: process.env.SLACK_SIGNING,

    }
};
