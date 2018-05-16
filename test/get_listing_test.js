var assert = require('assert');
var fetch_listing = require('../get-listing/index');
const AWS = require('aws-sdk-mock');

var dynamoMock = {
    calls: 0,
    filterExpression: [],
    expressionAttributeValues: []
}

AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
    dynamoMock.calls++;
    dynamoMock.filterExpression.push(params['FilterExpression']);
    dynamoMock.expressionAttributeValues.push(params['ExpressionAttributeValues'])
});

describe('get listing', function() {
    beforeEach(function() {
        dynamoMock = {
            calls: 0,
            filterExpression: [],
            expressionAttributeValues: []
        }
    })
    describe('get succeeds', function() {
        it('returns a valid listing', function() {
            var mockEvent = {
                listing_id: 1
            }
            var expectedFilterExpression = 'id = :hid';
            var expectedExpressionAttributeValues = {
                ':hid': mockEvent.listing_id
            }
            fetch_listing.getListing(mockEvent);
            assert.equal(dynamoMock.calls, 1);
            assert.equal(dynamoMock.filterExpression[0], expectedFilterExpression);
            assert.deepEqual(dynamoMock.expressionAttributeValues[0], expectedExpressionAttributeValues )
        })


        it('get succeeds with valid date ranges provided', function() {
            var mockEvent = {
                start_date: 1,
                end_date: 2,
                minimum_num_days: 1
            }
            var expectedFilterExpression = 'start_date <= :rend and end_date >= :rstart and minimum_num_days >= :rdays';
            var expectedExpressionAttributeValues = {
                ':rstart': mockEvent.start_date,
                ':rend': mockEvent.end_date,
                ':rdays': mockEvent.minimum_num_days
            }
            fetch_listing.getListing(mockEvent);
            assert.equal(dynamoMock.calls, 1);
            assert.equal(dynamoMock.filterExpression[0], expectedFilterExpression )
            assert.deepEqual(dynamoMock.expressionAttributeValues[0], expectedExpressionAttributeValues)
        })
    })

    describe('get fails', function() {
        it('fails when event end date less than start date ', function() {
            var mockEvent = {
                start_date: 12,
                end_date: 2,
                minimum_num_days: 1
            }
            var f = function(){
                fetch_listing.getListing(mockEvent);
            }

            assert.throws(f, Error, "invalid dates given");
            assert.equal(dynamoMock.calls, 0)
        })
        it('fails when event does not contain a listing_id or start_date/end_date', function() {
            var mockEvent = {
                minimum_num_days: 1
            }
            var f = function(){
                fetch_listing.getListing(mockEvent);
            }

            assert.throws(f, Error, "no listing id or start/end date specified");
            assert.equal(dynamoMock.calls, 0)
        })
    })
})