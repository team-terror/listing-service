'use strict';

var AWS  = require('aws-sdk');
    

exports.getListing = function(event, context, callback) {
    var documentClient = new AWS.DynamoDB.DocumentClient();
    var listingParams = {
        TableName: process.env.TABLE_NAME ? process.env.TABLE_NAME : "terror-listings"
    }

    if (event.listing_id) {
        listingParams['FilterExpression']= 'id = :hid',
        listingParams['ExpressionAttributeValues'] = {
            ':hid': event.listing_id
        }
    } else if (event.start_date && event.end_date) {
        if (event.start_date > event.end_date) {
            var errorMessage = "invalid dates given"
            throw new Error(errorMessage)
        }

        var filterExpression = 'start_date <= :rend and end_date >= :rstart';
        listingParams['ExpressionAttributeValues'] = {
            ':rstart': event.start_date,
            ':rend': event.end_date,
        }

        if (event.minimum_num_days) {
            filterExpression = filterExpression.concat(" and minimum_num_days >= :rdays")
            listingParams['ExpressionAttributeValues'][':rdays']= event.minimum_num_days
        }

        listingParams['FilterExpression'] = filterExpression
    }

    documentClient.scan(listingParams, function(err, data) {
        if (err) {
            console.error(JSON.toString(err));
        }
		callback(err, data);
    });
}