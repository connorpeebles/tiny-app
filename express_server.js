var express = require("express");
var app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

var PORT = 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "connorlol"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "connorlol"
  }
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
  let user = req.cookies["user_id"];
  if (typeof user === "undefined") {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

app.get("/register", (req, res) => {
  let templateVars = {action: "/register", button: "Register"};
  res.render("register", templateVars);
})

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "") {
    res.status(400).send("<html><body><p>Error: The email and password fields cannot be empty.</p><p><a href='/register'>Register</a></p></body></html>")
  } else if (getIDfromEmail(email)) {
    res.status(400).send("<html><body><p>Error: The email entered is already registered.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>")
  } else {
    users[id] = {id: id, email: email, password: password};
    console.log(users);
    res.cookie("user_id", users[id]);
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  let templateVars = {action: "/login", button: "Login"};
  res.render("login", templateVars);
})

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = getIDfromEmail(email);

  if (!id) {
    res.status(403).send("<html><body><p>Error: The email entered has not been registered.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>")
  } else if (users[id]["password"] !== password) {
    res.status(403).send("<html><body><p>Error: Incorrect password.</p><p><a href='/login'>Login</a></p></body></html>")
  } else {
    res.cookie("user_id", users[id]);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let user = req.cookies["user_id"];
  if (typeof user === "undefined") {
    res.status(403).send("<html><body><p>Error: Please register or login to access your list of shortened URLs.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>")
  } else {
    let filteredDatabase = urlsForUser(user.id);
    console.log(filteredDatabase);
    let templateVars = {urls: filteredDatabase, user: req.cookies["user_id"]};
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  let user = req.cookies["user_id"]
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: "http://" + req.body.longURL, userID: user.id};
  console.log(urlDatabase);
  let url = "/urls/" + shortURL
  res.redirect(url);
});

app.post("/urls/:id/", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.longURL;
  urlDatabase[shortURL]["longURL"] = "http://" + longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  let user = req.cookies["user_id"];
  let shortURL = req.params.id;
  if (user.id !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send("<html><body>Error: You are not authorized to delete this URL.</body></html");
  } else if (shortURL in urlDatabase) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(404).send('<html><body>Error: Shortened URL does not exist. See current <a href="/urls">list of shortened URLS</a> or <a href="/urls/new">add a new URL</a>.</body></html>')
  }
});

app.get("/urls/new", (req, res) => {
  let templateVars = {user: req.cookies["user_id"]};
  if (typeof templateVars.user === "undefined") {
    res.redirect("/register");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  let user = req.cookies["user_id"];
  let shortURL = req.params.id;
  if (typeof user === "undefined") {
    res.status(403).send("<html><body><p>Error: Please register or login.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>")
  } else if (!(shortURL in urlDatabase)) {
    res.status(404).send('<html><body>Error: Shortened URL does not exist. See current <a href="/urls">list of shortened URLS</a> or <a href="/urls/new">add a new URL</a>.</body></html>')
  } else if (user.id !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send("<html><body>Error: You are not authorized to edit this URL.</body></html");
  } else {
    let templateVars = {shortURL: shortURL, longURL: urlDatabase[shortURL]["longURL"], user: req.cookies["user_id"]};
    res.render("urls_show", templateVars);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (shortURL in urlDatabase) {
    let longURL = urlDatabase[shortURL]["longURL"];
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

function getIDfromEmail(email) {
  for (var user in users) {
    if (users[user]["email"] === email) {
      return user;
    }
  }
  return false;
}

function urlsForUser(id) {
  var filteredDatabase = {};
  for (var url in urlDatabase) {
    if (urlDatabase[url]["userID"] === id) {
      filteredDatabase[url] = urlDatabase[url];
    }
  }
  return filteredDatabase;
}