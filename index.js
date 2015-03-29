var Gitter = require('node-gitter');
var config = require('./config.json');

var roomUri = process.argv[2] || '';
var token = config.token;
var messageTemplate = /^calc[\s]+([0-9\(\)\+\-\*\/\s)]+)$/i;

var gitter = new Gitter(token);
gitter.currentUser()
.then(function (user) {
    console.log('Logged as', user.username);
    return gitter.rooms.join(roomUri)
})
.then(function(room) {
    console.log('Joined room:', room.name);
    room.listen().on('message', function (message) {
        var msg = message.text;
        console.log('New message:', msg);
        if (messageTemplate.test(msg)) {
            var exp = messageTemplate.exec(msg)[1] || '';
            try {
                room.send(exp + ' = ' + eval(exp));
            } catch (e) {
                room.send('Invalid calc expression');
            }
        }
    });
})
.fail(function(err) {
    console.log('Cannot join the room');
});