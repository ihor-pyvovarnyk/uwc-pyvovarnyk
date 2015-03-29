var Gitter = require('node-gitter');

/**
 * Represents gitter calc bot
 * @param token {string} User token
 * @param roomUri {string} Room uri
 * @constructor
 */
function Bot(token, roomUri) {
    this._token = token || '';
    this._roomUri = roomUri || '';
    this._gitter = null;
    this._room = null;
}

Bot.prototype.CALC_MSG_TEMPLATE = /^calc[\s]+([0-9\(\)\+\-\*\/\s)]+)$/i;

/**
 * Runs the calc bot
 */
Bot.prototype.run = function() {
    this._gitter = new Gitter(this._token);
    this._gitter.currentUser()
        .then(this.logInCallback.bind(this))
        .fail(this.logInFail.bind(this));
};

/**
 * Handles successful logging in
 * @param user {Object} User object
 */
Bot.prototype.logInCallback = function (user) {
    console.log('Logged as', user.username);
    this._gitter.rooms.join(this._roomUri)
        .then(this.joinRoomCallback.bind(this))
        .fail(this.joinRoomFail.bind(this));
};

/**
 * Handles log in fail
 * @param err {Object} Error object
 */
Bot.prototype.logInFail = function (err) {
    console.log('Login error');
};

/**
 * Handles successful joining to room
 * @param room {Room} Joined room
 */
Bot.prototype.joinRoomCallback = function (room) {
    this._room = room;
    console.log('Joined room:', this._room.name);
    room.listen().on('message', this.messageListener.bind(this));
};

/**
 * Handles new messages in chat
 * @param message {Object} Message object
 */
Bot.prototype.messageListener = function (message) {
    var msg = message.text;
    console.log('New message:', msg);
    if (this.CALC_MSG_TEMPLATE.test(msg)) {
        var exp = this.CALC_MSG_TEMPLATE.exec(msg)[1] || '';
        try {
            this._room.send(exp + ' = ' + eval(exp));
        } catch (e) {
            this._room.send('Invalid calc expression');
        }
    }
};

/**
 *
 * @param err {Object} Error object
 */
Bot.prototype.joinRoomFail = function (err) {
    console.log('Cannot join the room');
};

module.exports = Bot;