var AWS = require("aws-sdk");


exports.readNext = function() {
    AWS.config.update({
        region: "us-west-1",
        endpoint: "http://localhost:8000"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("reading next tweet from DynamoDB table");

    //query expression
    // var params = {
    //     TableName : "tweetbottweets",
    //     KeyConditionExpression: "#tweetdate = :tweetdate",
    //     ExpressionAttributeNames:{
    //         "#tweetdate": "tweetdate"
    //     },
    //     ExpressionAttributeValues: {
    //         ":tweetdate": "0"
    //     }
    // };

    //scan query
    var params = {
        TableName: "tweetbottweets",
        ProjectionExpression: "createdate, #tweetdate",
        FilterExpression: "#tweetdate = :tweetdate",
        ExpressionAttributeNames: {
            "#tweetdate": "tweetdate"
        },
        ExpressionAttributeValues: {
            ":tweetdate": "0"
        },
        Limit: 1

    }

    //Limit: 1 - this restricts rows to be filtered, not the matched rows

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all
            console.log("Scan succeeded.");

            //todo: check for result and resturn first
            //data.Items.forEach(function (item) {
            //    console.log(item.createdate + " / " + item.tweetdate);
            //});
            if(data.Items != null && data.Items.size() > 0){
                console.log(item.createdate + " / " + data.Items[0].tweetdate);
            }
            else{
                console.log(".. no matching items");
            }
        }
    }

}

//query by key
// docClient.query(params, function(err, data) {
//     if (err) {
//         console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Query succeeded.");
//         data.Items.forEach(function(item) {
//             console.log(item.insertdate + ": " + item.tweetdate);
//         });
//     }
// });