'use strict';

var AWS  = require('aws-sdk'),
	uuid = require('uuid');

exports.createListing = function(event, context, callback) {
    var documentClient = new AWS.DynamoDB.DocumentClient(); 

	var params = {
		Item : {
			"id" : uuid.v1(),
            "property_id" : event.property_id,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "minimum_num_days": event.minimum_num_days
		},
		TableName : process.env.TABLE_NAME ? process.env.TABLE_NAME : "terror-listing"
	};
    
    documentClient.put(params, function(err, data){
        console.log('this works?', data)
		callback(err, data);
    });
}
