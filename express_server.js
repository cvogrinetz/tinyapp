const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString, emailLookup, returnUserID } = require('./helpers');


app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['bitterfunk']
}));


// Data Storage Objects

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};



const users = {
  // "kq5hcg": {
  //   id: 'kq5hcg',
  //   email: 'bitterfunk@example.com',
  //   password: 'bittertang'
  // },
  // "zl2ape": {
  //   id: 'zl2ape',
  //   email: 'example@example.com',
  //   password: 'example'
  // }
};



// POST paths

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  return res.redirect(`/urls/${shortURL}`);
});


app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    return res.status(400).redirect("/login");
  }
  delete urlDatabase[req.params.shortURL];
  return res.redirect('/urls');
});


app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    return res.status(400).redirect("/login");
  }
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.edit;
  return res.redirect(`/urls/${shortURL}`);
});


app.post("/login", (req, res) => {
  if (!emailLookup(req.body.email, users)) {
    return res.status(403).send('Error Email doesnt exist');
  }

  const id = returnUserID(req.body.email, users);

  if (!bcrypt.compareSync(req.body.password, users[id].password)) {
    return res.status(403).send('Error wrong password. Try Again!');
  }
  req.session.user_id = users[id].id;
  return res.redirect("/urls");
});
  

app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/urls");
});


app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send(' Error 400 : Invalid email or password');
    res.end();
  } else if (emailLookup(req.body.email, users)) {
    res.status(400).send('Error 400 : Email already exists');
    res.end();
  } else {
    let id = generateRandomString();
    let password = bcrypt.hashSync(req.body.password, 10);
    users[id] = { id: id, email: `${req.body.email}`, password: `${password}`};
    req.session.user_id = users[id].id;
    return res.redirect("/urls");
  }
});

   

// GET paths

app.get("/", (req, res) => {
  return res.send(`Welcome!`);
});


app.get("/urls", (req, res) => {
  if (!users[req.session.user_id]) {
    return res.redirect("/login");
  }
  const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  return res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  if (!users[req.session.user_id]) {
    return res.redirect("/login");
  }
  const templateVars = { user: users[req.session.user_id] };
  return res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.session.user_id] };
  return res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  return res.redirect(longURL);
});


app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  return res.render('urls_register', templateVars);
});


app.get('/login', (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  return res.render('urls_login', templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



// Listen Paths

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});