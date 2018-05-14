var assert = require('assert');
var listing_creation = require('../create-listing/index');
const AWS = require('aws-sdk-mock');
AWS.Promise = Promise.Promise;

AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback)
{
   callback(null, { Item: params.Item });
   return 201
});

describe('create listing', function() {
    describe('post', function() {
        var testEvent = {
            property_id: 123,
            start_date: '12-13-2019',
            end_date: '12-13-2019',
            minimum_num_days: 1,
        }
        it('should return a 201 when the listing is created', function() {
            listing = listing_creation.createListing(testEvent, '');
            console.log(listing)
            assert.equal(listing, 201);
        });
    })
});
