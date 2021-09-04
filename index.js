require('dotenv').config();
const { App } = require('@slack/bolt');
const top = require('./top');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// アプリ起動
const main = async () => {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`Bolt is running at port:${port}.`);
};

main().catch((e) => {
    console.error(e);
});