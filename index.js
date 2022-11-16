var OAuth = require("oauth");
var TweetCache = require('./tweet-cache.js');
var read = require('./readsourcedata-promise.js');
var update = require('./update.js');

//load config from file
var config = require("./config/config.json");

/**
 * Sents a Tweet using Twitter APIs. Authenticates with Twitter using OAuth.
 * 
 * Text to be sent is read from a staging table using module readsourcedata-promise.js. This
 * reads from a source table that is populated with messages queued for sending, e.g.
 * using text generation, or other means.
 * 
 * Does not currently check for duplicate Tweets before sending, but module tweet-cache.js
 * provides this feature, to avoid sending previously sent tweets within a given time period.
 * This module is not used my this bot since the source of messages to send is from the
 * stageg source table, but this feature is used by other Tweet bots.
 * 
 * @kevinhooke March 2018 
 */
exports.sendtweet = async function() {

    //check for required values
    var configComplete = true;
    if (config.sendTweetEnabled == undefined || config.sendTweetEnabled == "") {
        console.log("config.json: sendTweetEnabled value is missing - set to true | false");
        configComplete = false;
    }
    if (config.twitterConsumerKey == "") {
        console.log("config.json: twitterConsumerKey value is missing");
        configComplete = false;
    }
    if (config.twitterSecretKey == "") {
        console.log("config.json: twitterSecretKey value is missing");
        configComplete = false;
    }
    if (config.accessToken == "") {
        console.log("config.json: accessToken value is missing");
        configComplete = false;
    }
    if (config.accessTokenSecret == "") {
        console.log("config.json: accessTokenSecret value is missing");
        configComplete = false;
    }
    if (!configComplete) {
        process.exit(1);
    }
    else {
        console.log("config.json read successfully");
        console.log("... config.sendTweetEnabled: " + config.sendTweetEnabled);
        //console.log("... config.twitterConsumerKey: " + config.twitterConsumerKey);
        //console.log("... config.twitterSecretKey: " + config.twitterSecretKey);
        //console.log("... config.accessToken: " + config.twitterConsumerKey);
        //console.log("... config.accessTokenSecret: " + config.accessTokenSecret);
    }

    var oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        config.twitterConsumerKey,
        config.twitterSecretKey,
        '1.0A',
        null,
        'HMAC-SHA1'
    );

    let data = await read.readNext();
    console.log("data: " + JSON.stringify(data));

    //todo: get first item only
    //data.Items.forEach(function (item) {
    if (data.Items != null && data.Items.length > 0) {
        var item = data.Items[0];

        console.log(item.createdate + " / " + item.tweetdate + " / " + item.tweettext);

        var status = ({
            'status': item.tweettext
        });

        console.log(new Date() + status);

        if (config.sendTweetEnabled == "true") {

            oauth.post('https://api.twitter.com/1.1/statuses/update.json',
                config.accessToken,
                config.accessTokenSecret,
                status,
                function (error, data) {
                    console.log('\nPOST status:\n');
                    console.log(error || data);
                });
        }
        else {
            console.log("config.sendTweetEnabled: false, status: " + JSON.stringify(status));
        }

        update.updateSourceTweet(item.createdate);
    }
    else{
        console.log("No matching source text rows from table");
    }
}

