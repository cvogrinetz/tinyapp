const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // defaul port 8080

app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Alrighty then")
});


app.get("/", (req, res) => {
  res.send(`Welcome!`)
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]  };
  res.render("urls_show", templateVars)
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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
