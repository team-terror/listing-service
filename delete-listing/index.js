'use strict';

var AWS  = require('aws-sdk');


exports.deleteListing = function(event, context, callback) {
    var documentClient = new AWS.DynamoDB.DocumentClient();

    var listingParams = {
        TableName: process.env.TABLE_NAME ? process.env.TABLE_NAME : "terror-listings",
    }


    documentClient.scan(listingParams, function(err, data) {
        if (err) {
            console.error(JSON.toString(err));
        }
        callback(err, data);
    });
}