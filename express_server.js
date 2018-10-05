// requirements
const express = require("express");
const app = express();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "session",
  secret: "this better work"
}));

const bcrypt = require("bcrypt");

// default port 8080
const PORT = 8080;

let total_visits = 0;

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`); // eslint-disable-line no-console
});

// import url and user data and required functions from modules
const urlDatabase = require("./data_urls");
const users = require("./data_users");
const func = require("./functions");

// GET /
// redirects to /login if user is not logged in, else /urls
app.get("/", (req, res) => {
  let user = req.session.user_id;

  if (user == null) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

// GET /urls
// renders list of urls for a user if user logged in, else error message
app.get("/urls", (req, res) => {
  let user = req.session.user_id;

  if (user == null) {
    res.status(403).send("<html><body><p>Error: Please register or login to access your list of shortened URLs.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>");
  } else {
    let filteredDatabase = func.urlsForUser(user.id);
    let templateVars = {urls: filteredDatabase, user: user};
    res.render("urls_index", templateVars);
  }
});

// GET /urls/new
// renders form to add new short URL if user logged in, else redirects to login
app.get("/urls/new", (req, res) => {
  let user = req.session.user_id;

  if (user== null) {
    res.redirect("/login");
  } else {
    let templateVars = {user: user};
    res.render("urls_new", templateVars);
  }
});

// GET /urls/:id
// renders form to edit short URL with :id if user is logged in, :id exists, and :id belongs to user, else error message
app.get("/urls/:id", (req, res) => {
  let user = req.session.user_id;
  let shortURL = req.params.id;

  if (user == null) {
    res.status(403).send("<html><body><p>Error: Please register or login.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>");
  } else if (!(shortURL in urlDatabase)) {
    res.status(404).send("<html><body>Error: Shortened URL does not exist. See current <a href=\"/urls\">list of shortened URLS</a> or <a href=\"/urls/new\">add a new URL</a>.</body></html>");
  } else if (user.id !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send("<html><body>Error: You are not authorized to edit this URL.</body></html>");
  } else {
    let templateVars = {shortURL: shortURL, longURL: urlDatabase[shortURL]["longURL"], user: user, views: total_visits};
    res.render("urls_show", templateVars);
  }
});

// GET /u/:id
// redirects shortURL :id to corresponding longURL if shortURL in database, else error message
app.get("/u/:id", (req, res) => {
  let shortURL = req.params.id;

  if (shortURL in urlDatabase) {
    total_visits += 1;
    // if (!req.session.visitor) {
    //   req.session.uniqueViews = (req.session.views || 0) + 1;
    // }

    let longURL = urlDatabase[shortURL]["longURL"];
    res.redirect(longURL);
  } else {
    res.status(404).send("<html><body>Error: Shortened URL does not exist.</body></html>");
  }
});

// POST /urls
// (form is generated from GET /urls/new)
// generates new shortURL from inputted longURL and redirects to /urls/shortURL if user logged in, else error message
app.post("/urls", (req, res) => {
  let user = req.session.user_id;

  if (user == null) {
    res.status(403).send("<html><body>Error: Please register or login.</body></html>");
  } else {
    let shortURL = func.generateRandomString();
    urlDatabase[shortURL] = {longURL: "http://" + req.body.longURL, userID: user.id};
    let url = "/urls/" + shortURL;
    res.redirect(url);
  }
});

// PUT /urls/:id
// (form is generated from GET /urls/:id)
// updates longURL associated with shortURL :id and redirects to /url, if user is logged in, :id exists, and :id belongs to user, else error message
app.put("/urls/:id/", (req, res) => {
  let user = req.session.user_id;
  let shortURL = req.params.id;
  let longURL = req.body.longURL;

  if (user == null) {
    res.status(403).send("<html><body>Error: Please register or login.</body></html>");
  } else if (!(shortURL in urlDatabase)) {
    res.status(404).send("<html><body>Error: Shortened URL does not exist.</body></html>");
  } else if (user.id !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send("<html><body>Error: You are not authorized to edit this URL.</body></html>");
  } else {
    urlDatabase[shortURL]["longURL"] = "http://" + longURL;
    res.redirect("/urls");
  }
});

// DELETE /urls/:id/
// (form is generated from GET /urls)
// deletes shortURL :id from database, if user is logged in, :id exists, and :id belongs to user, else error message
app.delete("/urls/:id/", (req, res) => {
  let user = req.session.user_id;
  let shortURL = req.params.id;

  if (user == null) {
    res.status(403).send("<html><body>Error: Please register or login.</body></html>");
  } else if (!(shortURL in urlDatabase)) {
    res.status(404).send("<html><body>Error: Shortened URL does not exist.</body></html>");
  } else if (user.id !== urlDatabase[shortURL]["userID"]) {
    res.status(403).send("<html><body>Error: You are not authorized to delete this URL.</body></html>");
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// GET /login
// renders login page if user not logged in, else redirect to /urls
app.get("/login", (req, res) => {
  let user = req.session.user_id;

  if (user == null) {
    let templateVars = {action: "/login", button: "Login"};
    res.render("login", templateVars);
  } else {
    res.redirect("/urls");
  }
});

// GET /register
// renders register page if user not logged in, else redirect to /urls
app.get("/register", (req, res) => {
  let user = req.session.user_id;

  if (user == null) {
    let templateVars = {action: "/register", button: "Register"};
    res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

// POST /login
// (form is generated from GET /login)
// sets cookie and redirects to /urls if email and password match database, else error message
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = func.getIDfromEmail(email);

  if (!id) {
    res.status(403).send("<html><body><p>Error: The email entered has not been registered.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>");
  } else if (bcrypt.compareSync(password, users[id]["password"])) {
    req.session.user_id = users[id];
    res.redirect("/urls");
  } else {
    res.status(403).send("<html><body><p>Error: Incorrect password.</p><p><a href='/login'>Login</a></p></body></html>");
  }
});

// POST /register
// (form is generated from GET /register)
// adds new user to users database, sets cookie, and redirects to /urls if email and password fields not blank and email not already registered, else error message
app.post("/register", (req, res) => {
  let id = func.generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  let hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || password === "") {
    res.status(400).send("<html><body><p>Error: The email and password fields cannot be empty.</p><p><a href='/register'>Register</a></p></body></html>");
  } else if (func.getIDfromEmail(email)) {
    res.status(400).send("<html><body><p>Error: The email entered is already registered.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>");
  } else {
    users[id] = {id: id, email: email, password: hashedPassword};
    req.session.user_id = users[id];
    res.redirect("/urls");
  }
});

// POST /logout
// (form is generated in header)
// deletes cookies and redirects to /urls
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});

// GET /urls.json
// renders list of urls for user as a json if user logged in, else error message
app.get("/urls.json", (req, res) => {
  let user = req.session.user_id;

  if (user == null) {
    res.status(403).send("<html><body><p>Error: Please register or login to access your list of shortened URLs.</p><p><a href='/register'>Register</a> &nbsp;|&nbsp; <a href='/login'>Login</a></p></body></html>");
  } else {
    let filteredDatabase = func.urlsForUser(user.id);
    res.json(filteredDatabase);
  }
});