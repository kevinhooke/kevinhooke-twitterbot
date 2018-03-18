var send = require('./index.js');

exports.handler = (event, context, callback) => {

    console.log('lambda-sendtweet called');

    send.sendtweet();

};