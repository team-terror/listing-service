var assert = require('assert');
var listing_creation = require('./listing_creation');

describe('create_listing', function() {
    describe('post', function() {
        it('should return a 201 when the listing is created', function() {
            listing = listing_creation('property', 'start date', 'end date');
            assert.equal(listing.status, 201);
        });
    })
});
