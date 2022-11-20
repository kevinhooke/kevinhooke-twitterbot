let Mastodon = require('mastodon-api');
let config = require('./config/config-mastodon.json');

exports.postMastodon = async (item) => {

    const M = new Mastodon({
        access_token: config['access-token'],
        api_url: 'https://botsin.space/api/v1/',
    });

    let promise = new Promise( (resolve, reject) => M.post('statuses', {
        "status" : item.tweettext
        })
        .then((resp) => {
            console.log(resp.data);
            resolve(resp.data);
        })
    );
    return promise;
}