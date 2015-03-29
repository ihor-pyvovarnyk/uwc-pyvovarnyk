var config = require('./config.json');
var Bot = require('./bot.js');

var calcBot = new Bot(config.token, process.argv[2]);
calcBot.run();