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
 const user = mongoose.model('User', user);
 const recipe = mongoose.model('Recipe', recipe);


 // Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});