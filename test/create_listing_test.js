var assert = require('assert');
var listing_creation = require('../create-listing/index');
const AWS = require('aws-sdk-mock');
AWS.Promise = Promise.Promise;

var dynamoMock = {
    calls: 0,
    items: [],
    error: null
}

AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
    dynamoMock.calls++;
    dynamoMock.items.push(params.Item)
});

describe('create listing', function() {
    beforeEach(function(){
        dynamoMock = {
            calls: 0,
            items: [],
            error: null
        }
    })
    describe('put succeeds', function() {
        var testEvent = {
            property_id: 'create-listing-test-succeeds',
            start_date: Date.now()*2,
            end_date: Date.now()*3,
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
    describe('put fails', function() {
        var invalidStartDateEvent = {
            property_id: 'create-listing-test-fails-start-date',
            start_date: Date.now()-10,
            end_date: Date.now(),
            minimum_num_days: 1,
        }
        it('should fail when start_date is before now', function() {
            var f = function() { listing_creation.createListing(invalidStartDateEvent, ''); }
            assert.throws(f , Error, "invalid dates given");
            assert.equal(dynamoMock.calls, 0);
        });
        var invalidEndDateEvent = {
            property_id: 'create-listing-test-fails-end-date',
            start_date: Date.now()*2,
            end_date: Date.now(),
            minimum_num_days: 1,
        }
        it('should fail when end_date is before start_date', function() {
            var f = function() { listing_creation.createListing(invalidEndDateEvent, ''); }
            assert.throws(f , Error, "invalid dates given");
            assert.equal(dynamoMock.calls, 0);
        });
    })
});
