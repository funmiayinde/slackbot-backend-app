import AppSchema from '../../../_core/app.model';
import mongoose, {Schema} from 'mongoose';
import SlackBotProcessor from './slack-bot.processor';

/**
 * SlackBotSchema
 * */
const SlackBotSchema = new AppSchema({
	name: {
		type: String,
		trim: true
	},
	response: {
		type: Schema.Types.Mixed,
		trim: true,
	},
	deleted: {
		type: Boolean,
		default: false,
		select: false,
	},
}, {
	autoCreate: true,
	timestamps: true,
	toJSON: { virtuals: true}
});


SlackBotSchema.statics.hiddenFields = ['deleted'];

/**
 * @param {Model} model required for response
 * @return {Object} The processor class instance object
 * */
 SlackBotSchema.statics.getProcessor = (model) => {
	return new SlackBotProcessor(model);
};

/**
 * @typedef SlackBotModel
 */
export const SlackModel = mongoose.model('SlackBot', SlackBotSchema);
