import { App } from '@slack/bolt';
import config from 'config';
import { SlackModel } from './rest/v1/slack-bot/slack-bot.model';
import _ from 'lodash';

export default async () => {
    const app = new App({
        token: config.get('slack.user_token'),
        signingSecret: config.get('slack.signing'),
    });
    console.log('loading...here');
    let response = {};
    app.command('/bot', async ({ ack, payload, context }) => {
        ack();
        try {
            const result = await app.client.chat.postMessage({
                token: context.botToken,
                channel: payload.channel_id,
                "blocks": [
                    {
                        "type": "divider"
                    },
                    {
                        "type": "input",
                        "label": {
                            "type": "plain_text",
                            "text": "Welcome. How are you doing?",
                            "emoji": true
                        },
                        "element": {
                            "type": "static_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select your mood",
                                "emoji": true
                            },
                            "options": [
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Doing Well",
                                        "emoji": true
                                    },
                                    "value": "Doing Well"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Neutral",
                                        "emoji": true
                                    },
                                    "value": "Neutral"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Feeling Lucky",
                                        "emoji": true
                                    },
                                    "value": "Feeling Lucky"
                                }
                            ],
                            "action_id": "select_action"
                        },
                    }
                ]
            });
        }
        catch (error) {
            console.error(error);
        }
    });
    app.action('select_action', async ({ ack, body, context }) => {
        ack();
        _.extend(response, {mood: body.actions[0].selected_option.value});
        try {
            const result = await app.client.chat.update({
                token: context.botToken,
                ts: body.message.ts,
                channel: body.channel.id,
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "What are your favorite hobbies?"
                        },
                        "accessory": {
                            "type": "multi_static_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select your hobbies",
                                "emoji": true
                            },
                            "options": [
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Football",
                                        "emoji": true
                                    },
                                    "value": "Football"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Music",
                                        "emoji": true
                                    },
                                    "value": "Music"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Sleep",
                                        "emoji": true
                                    },
                                    "value": "Sleep"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Movies",
                                        "emoji": true
                                    },
                                    "value": "Movies"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Basketball",
                                        "emoji": true
                                    },
                                    "value": "Basketball"
                                },
                            ],
                            "action_id": "multi_conversations_select_action"
                        }
                    }
                ]
            });
        }
        catch (error) {
            console.error('slack-error:', error);
        }
    });

    app.action('multi_conversations_select_action', async ({ ack, body, context }) => {
        ack();
        const {user: {name} } = body;
        _.extend(response, {
            hobbies: body.actions[0].selected_options.map(({value}) => value)
        });
        try {
            const result = await app.client.chat.update({
                token: context.botToken,
                ts: body.message.ts,
                channel: body.channel.id,
                "blocks": [
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": "Thank you!",
                            "emoji": true
                        }
                    }
                ],
            });
            console.log('response:', response);
            let saveResponse = new SlackModel({ name, response});
            saveResponse = await saveResponse.save();
            if (saveResponse){
                response = {};
            }
        }
        catch (error) {
            console.error('slack-error:', error);
        }
    });
    return await app.start(3000)
        .then(() => {
            console.log('⚡️ Bolt app is running!');
        }).catch(error => {
            console.log('bot err:', error)
            throw error;
        });
};