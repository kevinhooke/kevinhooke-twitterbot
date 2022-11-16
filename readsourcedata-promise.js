let AWS = require("aws-sdk");

exports.readNext = function() {
    AWS.config.update({
        region: "us-west-1",
        //endpoint: "http://localhost:8000"
        endpoint : "https://dynamodb.us-west-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("reading next tweet from DynamoDB table");

    //previous approach with scan
    // var params = {
    //     TableName: "tweetbottweets",
    //     ProjectionExpression: "createdate, #tweetdate, tweettext",
    //     FilterExpression: "#tweetdate = :tweetdate",
    //     ExpressionAttributeNames: {
    //         "#tweetdate": "tweetdate"
    //     },
    //     ExpressionAttributeValues: {
    //         ":tweetdate": "0"
    //     }
    // }
    //
    // return docClient.scan(params).promise();

    //improved approach querying a global secondary index, also using Limit to restrict
    //number of rows scanned and therefore returned return the first row found)
    let params = 
    {
        "TableName": "tweetbottweets",
        "IndexName": "tweetdate-createdate-index",
        "KeyConditionExpression": "tweetdate = :tweetdate",
        "ExpressionAttributeValues": {
            ":tweetdate": "0"
        },
        "ProjectionExpression": "createdate, tweetdate, tweettext",
        "ScanIndexForward": false,
        "Limit": 1
    }
    return docClient.query(params).promise();
}
