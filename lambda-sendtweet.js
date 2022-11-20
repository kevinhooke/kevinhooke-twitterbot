let sendTweet = require('./sendtweet.js');
let mastodon = require('./send-mastodon');
let readMessage = require('./readsourcedata-promise.js');
let updateMessage = require('./update.js');

exports.handler = async (event) => {

    console.log('lambda-sendtweet called');

    //retrieve next message to send
    let data = await readMessage.readNext();
    console.log("data: " + JSON.stringify(data));
    if (data.Items != null && data.Items.length > 0) {
        let item = data.Items[0];

        //send tweet via Twitter apis
        console.log("About to call sendTweet() ...");
        sendTweet.sendtweet(item);
        console.log("... sendTweet() done");

        //sent toot via Mastondon apis
        console.log("About to call postMastodon() ...");
        let response = await mastodon.postMastodon(item);
        console.log("... postMastodon() done");

        //update source table marking this item as sent
        console.log("About to call updateSourceTweet() ...");      
        let result = await updateMessage.updateSourceTweet(item.createdate);
        console.log("... updateSourceTweet() done")
    }
    else{
        console.log("No matching source text rows from table");
    }


};