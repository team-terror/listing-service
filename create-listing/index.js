'use strict';

var AWS  = require('aws-sdk'),
	uuid = require('uuid');

exports.createListing = function(event, context, callback) {
    
    var now = Date.now();
    if (now > event.start_date || event.start_date > event.end_date) {
        var errorMessage = "invalid dates given"
        throw new Error(errorMessage)
    }

    // check property_id exists
    // ??? check user is owner of property
    
    var documentClient = new AWS.DynamoDB.DocumentClient(); 
	var params = {
		Item : {
			"id" : uuid.v1(),
            "property_id" : event.property_id,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "minimum_num_days": event.minimum_num_days
		},
		TableName : process.env.TABLE_NAME ? process.env.TABLE_NAME : "terror-listings"
	};
    
    documentClient.put(params, function(err, data) {
        if (err) {
            console.error(JSON.toString(err));
        }
        callback(err, data);
    });
}
