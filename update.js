var AWS = require("aws-sdk");

exports.updateSourceTweet = function(createdate) {

    console.log("updateSourceTweet called...");

    AWS.config.update({
        region: "us-west-1",
        //endpoint: "http://localhost:8000"
        endpoint : "https://dynamodb.us-west-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var now = new Date().getTime().toString();

    var params = {
        TableName: "tweetbottweets",
        Key: {
            "createdate": createdate
        },
        UpdateExpression: "set tweetdate = :now",
        ExpressionAttributeValues: {
            ":now": now
        },
        ReturnValues: "UPDATED_NEW"
    };

    console.log("Updating the item...");
    return docClient.update(params).promise();
}