// app.mjs
import './config.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import './db.mjs';

const app = express();

import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const User = mongoose.model('User');
const Recipe = mongoose.model('Recipe');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


//Registering new users::
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('register', { error: 'Username already exists' });
  }

  // Create a new user
  const newUser = new User({
    username,
    password,
  });

  // Save the new user to the database
  newUser.save()
    .then(savedUser => {
      res.redirect('/login');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server error');
    });
});


// Render the login screen when the root route is accessed
app.get('/', (req, res) => {
  res.render('login');
});
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login authentication
app.post('/login', passport.authenticate('local', {
  successRedirect: '/recipes/add', // Redirect to the add recipe page on successful login
  failureRedirect: '/',             // Redirect back to the login screen on failed login
}));


//----------------------------------------




app.post('/recipes/add', isLoggedIn, async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  const r = new Recipe({
    title,
    ingredients,
    instructions,
    author: req.user._id, // Associate the recipe with the currently logged-in user
  });

  try {
    const savedRecipe = await r.save();
    // Add the created recipe to the user's createdRecipes array
    req.user.createdRecipes.push(savedRecipe._id);
    await req.user.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ...

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Redirect to login with a flash message indicating the need to log in
  req.flash('error', 'You need to log in to access this page');
  res.redirect('/login');
}

app.get('/recipes/add', isLoggedIn, async (req, res) => {
  try {
    // Fetch only recipes associated with the logged-in user
    const recipes = await Recipe.find({ author: req.user._id });
    res.render('recipe-create', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(process.env.PORT || 3000);