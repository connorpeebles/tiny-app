const users = require("./data_users");
const urlDatabase = require("./data_urls");

module.exports = {

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

  getIDfromEmail: function(email) {
    for (let user in users) {
      if (users[user]["email"] === email) {
        return user;
      }
    }

    return false;
  },

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