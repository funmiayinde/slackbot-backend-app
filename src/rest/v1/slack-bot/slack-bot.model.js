import AppSchema from '../../../_core/app.model';
import mongoose, {Schema} from 'mongoose';
import SlackBotProcessor from './slack-bot.processor';

/**
 * SlackBotSchema
 * */
const SlackBotSchema = new AppSchema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		trim: true
	},
	first_name: {
		type: String,
		trim: true,
	},
	last_name: {
		type: String,
		trim: true,
	},
	password: {
		type: String,
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
