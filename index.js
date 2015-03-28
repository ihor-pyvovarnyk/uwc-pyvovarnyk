var Gitter = require('node-gitter');
var config = require('./config.json');

var roomUri = process.argv[2] || '';
var token = config.token;
var messageTemplate = /^calc[\s]+([0-9\(\)\+\-\*\/\s)]+)$/i;

var gitter = new Gitter(token);
gitter.currentUser()
.then(function (user) {
    console.log('Logged as ' + user.username);
    gitter.rooms.join(roomUri)
    .then(function(room) {
        console.log('Joined room: ', room.name);
        var events = room.listen();
        events.on('message', function (message) {
            var msg = message.text;
            console.log('New message: ' + msg);
            if (messageTemplate.test(msg)) {
                var exp = messageTemplate.exec(msg)[1] || '';
                var resMsg = '';
                try {
                    resMsg = exp + ' = ' + eval(exp);
                } catch (e) {
                    resMsg = 'Invalid calc expression';
                }
                console.log(resMsg);
                room.send(resMsg);
            } else {
                console.log('Message don\'t match calc template');
            }
        });
    })
    .fail(function(err) {
        console.log('Not possible to join the room: ', err);
    });
});