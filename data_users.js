const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

const connorpass = bcrypt.hashSync("omglol",10)
const taypass = bcrypt.hashSync("iheartcats",10)

module.exports = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "connorlol": {
    id: "connorlol",
    email: "connor@example.com",
    password: connorpass
  },
  "tswift13": {
    id: "tswift13",
    email: "tswizzle@example.com",
    password: taypass
  }
};