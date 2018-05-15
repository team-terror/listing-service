var assert = require('assert');
var listing_creation = require('../create-listing/index');
const AWS = require('aws-sdk-mock');
AWS.Promise = Promise.Promise;

var dynamoMock = {
    calls: 0,
    items: [],
    error: null
}

AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback)
{
    dynamoMock.calls++;
    dynamoMock.items.push(params.Item)
});

describe('create listing', function() {
    describe('put', function() {
        var testEvent = {
            property_id: 'create-listing-test',
            start_date: 20180515,
            end_date: 20190515,
            minimum_num_days: 1,
        }
        it('should put expected item in DynamoDB', function() {
            listing_creation.createListing(testEvent, '');
            assert.equal(dynamoMock.calls, 1);
            assert.equal(dynamoMock.items[0].property_id, testEvent.property_id)
            assert.equal(dynamoMock.items[0].start_date, testEvent.start_date)
            assert.equal(dynamoMock.items[0].end_date, testEvent.end_date)
            assert.equal(dynamoMock.items[0].minimum_num_days, testEvent.minimum_num_days)
        });
    })
});
