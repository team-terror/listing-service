var assert = require('assert');
var delete_listing = require('../delete-listing/index');
const AWS = require('aws-sdk-mock');

var dynamoMock = {
    calls: 0,
    items: []
}

AWS.mock('DynamoDB.DocumentClient', 'delete', function (params, callback) {
    dynamoMock.calls++;
    dynamoMock.items.push(params.Key)
});

describe('delete listing', function() {
    beforeEach(function() {
        dynamoMock = {
            calls: 0,
            items: []
        }
    })
    // describe('delete succeeds', function() {
    //     it('deletes a listing', function() {
    //         var mockEvent = {
    //             listing_id: 1
    //         }
    //         var expectedItem = {
    //             "id": {
    //                 S: mockEvent.listing_id
    //             }
    //         }
    //         delete_listing.deleteListing(mockEvent);
    //         assert.equal(dynamoMock.calls, 1);
    //         assert.deepEqual(dynamoMock.items[0], expectedItem )
    //     })
    // })
    describe('delete fails', function() {
        it('fails when no listing_id is provided', function() {
            var mockEvent = {};
            var f = function(){
                delete_listing.deleteListing(mockEvent);
            }
            assert.throws(f, Error, "no listing id provided");
            assert.equal(dynamoMock.calls, 0);
        })
    })
})