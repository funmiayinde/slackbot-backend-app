import {Router} from 'express';
import SlackController from './slack-bot.controller';
import {SlackModel} from './slack-bot.model';
import response from '../../../middleware/response';

const router = Router();

const ctrl = new SlackController(SlackModel);

router.route('/slack-bots')
	.get(ctrl.find, response)
	.post(ctrl.create);

export default router;
