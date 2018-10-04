const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

const connorpass = bcrypt.hashSync("omglol",10);
const taypass = bcrypt.hashSync("iheartcats",10);
const randpass = bcrypt.hashSync("purple-monkey-dinosaur",10);
const rand2pass = bcrypt.hashSync("dishwasher-funk",10);

module.exports = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: randpass
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: rand2pass
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