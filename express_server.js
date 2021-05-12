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



// Objects

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = {
  "kq5hcg": {
    id: 'kq5hcg',
    email: 'bitterfunk@gmail.com',
    password: 'bittertang'
  }
};


// POST paths

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
  if(!emailLookup(req.body.email, users)) {
    return res.status(403).send('Error Email doesnt exist')
  } 

  const id = returnUserID(req.body.email, users);
  
  if (req.body.password !== users[id].password) {
    return res.status(403).send('Error wrong password. Try Again!');
  }
  res.cookie("user_id", id);
  return res.redirect("/urls");
});
  

app.post("/logout", (req, res) => {
  res.clearCookie("user_id", users[req.cookies["user_id"]])
  return res.redirect("/urls")
});


app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send(' Error 400 : Invalid email or password')
    res.end()
  } else if (emailLookup(req.body.email, users)) {
    res.status(400).send('Error 400 : Email already exists')
    res.end();
  } else {
    let id = generateRandomString()
    users[id] = { id: id, email: `${req.body.email}`, password: `${req.body.password}`}
    res.cookie("user_id", users[id].id)
    return res.redirect("/urls")
  };
})
  


// GET paths

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
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/register", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] };
  res.render('urls_register', templateVars)
});


app.get('/login', (req, res) => {
  const templateVars = { user: req.cookies['user_id'] };
  res.render('urls_login', templateVars)
});




// Listen Paths

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});




// Functions


// Short Url generator.
const generateRandomString = () => {
  return Math.random().toString(30).substr(2, 6)
};


// Compare new users to ones already stored in Users object
const emailLookup = (newUser, userObject) => {
  for(const user in userObject) {
    if(newUser === userObject[user].email) {
      return true; 
    }
  }
    return false;
};


// Used to get the user_id to be able to access Users objects in login Post
const returnUserID = (email, usersObject) => {
  for (let user in usersObject) {
    if (email === usersObject[user].email) {
      return usersObject[user].id
    }
  }
};