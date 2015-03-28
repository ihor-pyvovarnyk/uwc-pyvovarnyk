var Gitter = require('node-gitter');
var config = require('./../uwc-pyvovarnyk/config.json');

var roomUri = process.argv[2] || '';
var token = config.token;
var templateMessageRegEx = /calc[\s]+([0-9\(\)\+\-\*\/)]+)/g;

var gitter = new Gitter(token);
gitter.currentUser()
.then(function (user) {
    console.log('Logged as ' + user.username);
    gitter.rooms.join(roomUri)
    .then(function(room) {
        console.log('Joined room: ', room.name);
        var events = room.listen();
        events.on('message', function (message) {
            console.log('New message: ' + message.text);
        });
    })
    .fail(function(err) {
        console.log('Not possible to join the room: ', err);
    });
});