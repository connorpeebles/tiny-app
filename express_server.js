var express = require("express");
var app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var PORT = 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
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
    let templateVars = {shortURL: shortURL, longURL: urlDatabase[shortURL]};
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