require('dotenv').config();
const { App } = require('@slack/bolt');
const { respondToSslCheck } = require('@slack/bolt/dist/receivers/ExpressReceiver');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

const omikuji = () => {
    // 0~99
    const random = Math.floor( Math.random()*100 );

    if (random >= 90) {
        return '大吉';
    } else if (random >= 60) {
        return '中吉';
    } else if (random >= 15) {
        return '小吉';
    } else if (random >= 5) {
        return '凶';
    } else {
        return '大凶';
    }
};

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
                        text: 'おみくじを引く！'
                    },
                    action_id: 'do_omikuji'
                }
            }
        ],
        text: message
    });
});

// アクション
app.action('do_omikuji', async ({ack, body, logger, action, respond, payload}) => {
    logger.info(`${action.name} start`)
    await ack();

    const message = `${body.user.name}さんの運勢は【${omikuji()}】です`;
    await respond({
        response_type: 'in_channel',
        replace_original: true,
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
                        text: 'もう一度引く'
                    },
                    action_id: 'do_omikuji'
                }
            }
        ]
    });

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