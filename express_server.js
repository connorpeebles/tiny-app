var express = require("express");
var app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

var PORT = 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
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
    password: "omglol"
  },
  "tswift13": {
    id: "tswift13",
    email: "tswizzle@example.com",
    password: "iheartcats"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.status(400).send("<html><body><p>Error: The email and password fields cannot be empty.</p><p><a href='/register'>Register</a></p></body></html>")
  } else if (checkEmailExists(email)) {
    res.status(400).send("<html><body><p>Error: The email entered is already registered.</p><p><a href='/register'>Register</a> &nbsp;<a href='/login'>Login</a></p></body></html>")
  } else {
    users[id] = {id: id, email: email, password: password};
    console.log(users);
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = "http://" + req.body.longURL;
  console.log(urlDatabase);
  let url = "/urls/" + shortURL
  res.redirect(url);
});

app.post("/urls/:id/", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = "http://" + longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  console.log("shortURL: ", shortURL)
  delete urlDatabase[shortURL];
  console.log("urlDatabase: ", urlDatabase);
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  if (shortURL in urlDatabase) {
    let templateVars = {shortURL: shortURL, longURL: urlDatabase[shortURL], username: req.cookies["username"]};
    res.render("urls_show", templateVars);
  } else {
    res.send('<html><body>Error: Shortened URL does not exist. See current <a href="/urls">list of shortened URLS</a> or <a href="/urls/new">add a new URL</a>.</body></html>')
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (shortURL in urlDatabase) {
    let longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  } else {
    res.send('<html><body>Error: Shortened URL does not exist. See current <a href="/urls">list of shortened URLS</a> or <a href="/urls/new">add a new URL</a>.</body></html>')
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let output = "";

  for (let i = 0; i < 6; i++) {
    let randNum = Math.floor(Math.random() * 36);
    let char = chars.substring(randNum, randNum + 1);
    output += char;
  }

  return output;
}

function checkEmailExists(email) {
  for (var user in users) {
    if (users[user]["email"] === email) {
      return true;
    }
  }
  return false;
}