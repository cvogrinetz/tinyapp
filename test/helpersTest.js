const { assert } = require('chai');

const { emailLookup, returnUserID } = require('../helpers.js');

const testUsers = {
  "userRandomID" : {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return user with valid email', () => {
    const user = returnUserID('user@example.com', testUsers)
    const expectedOutput = 'userRandomID'

    assert.equal(user, expectedOutput);
  });
  it('should return undefined', () => {
    const user = returnUserID('userDoesNotExist.example.com, testUsers');
    const expectedOutput = undefined;

    assert.equal(user, expectedOutput);
  });
});

describe('emailLookup', () => {
  it('should return true if email exists', () => {
    const email = emailLookup('user@example.com', testUsers)
    const expectedOutput = true;

    assert.equal(email, expectedOutput);
  });
  it('should return false if no email matches', () => {
    const email = emailLookup('theresNoBirthdayPartyHere.example.com', testUsers)
    const expectedOutput = false;

    assert.equal(email, expectedOutput);
  })
})