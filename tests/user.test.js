const assert = require('chai').assert;
const users = require('../models/users');

const userok = { email: 'some199@email.com',
                 phone: '+1-541-854-3036',
                 firstName: 'John',
                 lastName: 'Dou',
                 birthday: '2018-10-16T09:31:44.992Z' };

describe('User', function() {
  describe('#create()', function() {
    it('should add one new user to DB', function(done) {
      let numOfUsers = users.count();
      users.create(userok).then(() => {
        assert.equal(users.count(), numOfUsers + 1, 'new user was added');
        done();
      });
    });
  });
});