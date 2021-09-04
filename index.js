require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// コマンド
app.command('/heroku-sample', async ({ack, say, command, logger}) => {
    logger.info(`${command.command} start`)
    await ack();
    const message = `こんにちは、<@${command.user_name}> from heroku`;
    await say({
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: message
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'クリック！'
                    },
                    action_id: 'button_click'
                }
            }
        ],
        text: message
    });
});

// アクション
app.action('button_click', async ({ack, body, say, logger, action}) => {
    logger.info(`${action.name} start`)
    await ack();
    await say(`${body.user.name}さんがボタンをクリックしました`);
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