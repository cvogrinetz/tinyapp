const generateRandomString = () => {
  return Math.random().toString(30).substr(2, 6);
};


// Compare new users to ones already stored in Users object
const emailLookup = (newUser, userObject) => {
  for (const user in userObject) {
    if (newUser === userObject[user].email) {
      return true;
    }
  }
  return false;
};


// Used to get the user_id to be able to access Users objects in login Post
const returnUserID = (email, usersObject) => {
  for (let user in usersObject) {
    if (email === usersObject[user].email) {
      return usersObject[user].id;
    }
  }
};

module.exports = {
  generateRandomString,
  emailLookup,
  returnUserID
};