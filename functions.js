const users = require("./data_users");
const urlDatabase = require("./data_urls");

module.exports = {

  // generates random 6 character string
  generateRandomString: function() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let output = "";

    for (let i = 0; i < 6; i++) {
      let randNum = Math.floor(Math.random() * 36);
      let char = chars.substring(randNum, randNum + 1);
      output += char;
    }

    return output;
  },

  // if the paramater email exists to a current user, returns user
  // else returns false
  getIDfromEmail: function(email) {
    for (let user in users) {
      if (users[user]["email"] === email) {
        return user;
      }
    }

    return false;
  },

  // returns all urls in the urlDatabase that belong to the user with paramater id
  urlsForUser: function(id) {
    let filteredDatabase = {};

    for (let url in urlDatabase) {
      if (urlDatabase[url]["userID"] === id) {
        filteredDatabase[url] = urlDatabase[url];
      }
    }

    return filteredDatabase;
  }

};