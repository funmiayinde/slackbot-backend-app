import AppController from '../../../_core/app.controller';
import { OK } from '../../../utils/codes';
import config from 'config';

/**
 * The SlackBotController
 * */
class SlackBotController extends AppController {
	/**
	 * @param {Model} model The default model object
	 * for the controller. Will be required to create
	 * an instance of the controller¬
	 */
	constructor(model) {
		super(model);
	}

	/* @param {Object} req The request object
	* @param {Object} res The response object
	* @param {Function} next The callback to the next program handler
	* @return {Object} res The response object
	*/
	async create(req, res, next) {
		const { App } = require("@slack/bolt");
		const app = new App({
			token: config.get('slack.user_token'),
			signingSecret: config.get('slack.signing'),
		});
		console.log('app:', app);
		app.event('/bot', async ({ event, client, context }) => {
			try {
				/* view.publish is the method that your app uses to push a view to the Home tab */
				const result = await client.views.publish({

					/* the user that opened your app's app home */
					user_id: event.user,

					/* the view object that appears in the app home*/
					view: {
						type: 'home',
						callback_id: 'home_view',

						/* body of the view */
						blocks: [
							{
								"type": "section",
								"text": {
									"type": "mrkdwn",
									"text": "*Welcome to your _App's Home_* :tada:"
								}
							},
							{
								"type": "divider"
							},
							{
								"type": "section",
								"text": {
									"type": "mrkdwn",
									"text": "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app."
								}
							},
							{
								"type": "actions",
								"elements": [
									{
										"type": "button",
										"text": {
											"type": "plain_text",
											"text": "Click me!"
										}
									}
								]
							}
						]
					}
				});
			}
			catch (error) {
				console.error('slack-error:', error);
			}
		});
	}
}

export default SlackBotController;
