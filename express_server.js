const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // defaul port 8080

app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


let urlDatabase = {
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
  }
};


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  return res.redirect(`/urls/${shortURL}`)
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  return res.redirect('/urls')
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[req.params.shortURL] = req.body.edit
  return res.redirect(`/urls/${shortURL}`)
});


app.post("/login", (req, res) => {
  res.cookie('username', req.body.username); 
  return res.redirect("/urls")
});

app.post("/logout", (req, res) => {
res.clearCookie("username", req.body.username)
return res.redirect("/urls")
});

app.post("/register", (req, res) => {
  let id = generateRandomString()
  users[id] = { id: id, email: `${req.body.email}`, password: `${req.body.password}`}
  res.cookie("user_id", users[id].id)
  // console.log(req.cookies[user[id]])
  return res.redirect("/urls")
})



app.get("/", (req, res) => {
  res.send(`Welcome!`)
});


app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars)
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
});


app.get("/urls", (req, res) => {
  console.log(users[req.cookies["user_id"]])
  console.log(req.cookies)

  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/register", (req, res) => {
  // console.log(req.body)
  const templateVars = { user: req.cookies["user_id"] };
  res.render('urls_register', templateVars)
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// Short Url generator.
const generateRandomString = () => {
  return Math.random().toString(30).substr(2, 6)
};
