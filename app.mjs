import './config.mjs'; 

/*
// RESEARCH TOPIC 
import passport from 'passport';
import LocalStrategy from 'passport-local';

// Configure Passport.js for user authentication
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
*/

import express from 'express';
import mongoose from 'mongoose'; // Import mongoose

// Import the db.mjs file to execute database-related code
import './db.mjs';

import session from 'express-session';
const app = express();

// set up express static 
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// Retrieve the model registered with mongoose
const User = mongoose.model('User');
const Recipe = mongoose.model('Recipe');
/*
//AUTHENTICATION
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));
*/
app.post('/recipes/add', async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    
    // Save the recipe to the database
    const r = new Recipe({
        title,
        ingredients,
        instructions,
    });

    r.save()
    .then(savedRecipe => {
        res.redirect('/');

    })
    .catch(err => {
        console.error(err); // Log the error to the console
        res.status(500).send('Server error');
    });
});

app.get('/', async (req, res) => {
    // Fetch all recipes
    const recipes = await Recipe.find();
    res.render('recipe-edit', { recipes });
});


  


 // Start the Express server
 app.listen(process.env.PORT || 3000);




