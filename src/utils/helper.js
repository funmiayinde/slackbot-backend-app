import config from 'config';
import NodeGeocoder from 'node-geocoder';
import slugify from 'slugify';
import {User} from "../rest/v1/slack-bot/slack-bot.model";


/**
 * @param {Number} size Hour count
 * @return {Date} The date
 * */
export const addHourToDate = (size) => {
    const date = new Date();
    let hours = date.getHours() + 1;
    date.setHours(hours);
    return date;
};

/**
 * @param {Number} size code length
 * @param {Boolean} alpha Check if it's alpha numeral
 * @return {String} The code
 **/
export const generateOTCode = (size = 4, alpha = false) => {
    let characters = alpha ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : '0123456789';
    characters = characters.split('');
    let selections = '';
    for (let i = 0; i < size; i++) {
        let index = Math.floor(Math.random() * characters.length);
        selections += characters[index];
        characters.splice(index, 1);
    }
    return selections;
};


/**
 * This will setup auth seeded data
 * @param {Number} count
 **/
export const seedAccount = async (count = 5) => {
    try {
        await User.deleteMany({}).exec();
        for (let i = 0; i < count; i++) {
            const auth = await new User({
                email: `user${i + 1}@gmail.com`,
                password: 'password',
                account_verified: true
            });
            this.auth = await auth.save();
        }
    } catch (e) {
        console.log('seeding exception:::::', e);
    }
};
/**
 * @param {Object} address The String for the address
 * @param {Object} options
 * @return {Object}
 * */
export const addressToLatLng = async (address, options = {}) => {
    const geocoder = NodeGeocoder({
        provider: config.get('google.credentials.provider'),
        apiKey: config.get('google.credentials.apiKey'),
        ...options
    });
    return geocoder.geocode(address);
};

/**
 * Convert callback to promise
 * @param {String} text
 * @param {String} params date
 * @return {String}
 * */
export const slugifyText = (text) => {
    if (text === null || typeof text === 'undefined') {
        return text;
    }
    if (text.indexOf(' ') > 0) {
        return slugify(text.toLowerCase());
    }
    return text.toLowerCase();
};


