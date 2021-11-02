import AppController from '../../../_core/app.controller';
import { OK} from '../../../utils/codes';


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
		this.processMessage = this.processMessage.bind(this);
	}

	/* @param {Object} req The request object
	* @param {Object} res The response object
	* @param {Function} next The callback to the next program handler
	* @return {Object} res The response object
	*/
   async processMessage(req, res, next) {
	   req.response = {
		   code: OK,
		   model: this.model,
		   message: 'Processing slack message'
	   };
	   return next();
   }
}

export default SlackBotController;
