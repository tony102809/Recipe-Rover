// app.mjs
import './config.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import './db.mjs';
import flash from 'connect-flash';


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
app.use(flash());


const User = mongoose.model('User');
const Recipe = mongoose.model('Recipe');

//Passport.js authentication:::

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


app.get('/', (req, res) => {
  res.render('login');
});
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/welcome', 
  failureRedirect: '/',        
}));

//----------------------------------------

//WELCOME ROUTE:::
app.get('/welcome', isLoggedIn, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id });
    res.render('welcome', { user: req.user, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//FILTERING FUNCTIONALITY
// Higher-order function for recipe filtering
const filterRecipes = (ingredientsFilter, titleFilter) => {
  return (recipe) => {
    // Check for ingredients filter
    const hasIngredients = !ingredientsFilter || recipe.ingredients.toLowerCase().includes(ingredientsFilter.toLowerCase());

    // Check for title filter
    const hasTitle = !titleFilter || recipe.title.toLowerCase().includes(titleFilter.toLowerCase());

    // Return true only if both conditions are met
    return hasIngredients && hasTitle;
  };
};

// My Recipes Route
app.get('/my-recipes', isLoggedIn, async (req, res) => {
  try {
    // Get filter parameters from query string
    const { ingredientsFilter, titleFilter } = req.query;

    // Fetch all recipes for the user
    const allRecipes = await Recipe.find({ author: req.user._id });

    // Use Array.prototype.filter with the higher-order function
    const filteredRecipes = allRecipes.filter(filterRecipes(ingredientsFilter, titleFilter));

    res.render('my-recipes', { recipes: filteredRecipes, ingredientsFilter, titleFilter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//Adding new recipes::::
app.post('/recipes/add', isLoggedIn, async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  const r = new Recipe({
    title,
    ingredients,
    instructions,
    author: req.user._id, 
  });

  try {
    const savedRecipe = await r.save();
    req.user.createdRecipes.push(savedRecipe._id);
    await req.user.save();
    res.redirect('/welcome');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
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


// DELETING RECIPES::::
app.post('/recipes/delete/:recipeId', isLoggedIn, async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (recipe && recipe.author.equals(req.user._id)) {
      const index = req.user.createdRecipes.indexOf(recipeId);
      if (index !== -1) {
        req.user.createdRecipes.splice(index, 1);
        await req.user.save();
      }

      await Recipe.findByIdAndDelete(recipeId);
    } else {
      return res.status(404).send('Recipe not found or unauthorized');
    }

    // Users stay on the my-recipes page
    res.redirect('/my-recipes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//logging out:
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.redirect('/');
  });
});



app.listen(process.env.PORT || 3000);