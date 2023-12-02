import './config.mjs'; 

import mongoose from 'mongoose';

// User Schema
const User = new mongoose.Schema({
  username: String,
  password: String,
  savedRecipes: [String],
  createdRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
});

// Recipe Schema
const Recipe = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ingredients: String,
  instructions: String,
});

mongoose.model('User', User);
mongoose.model('Recipe', Recipe);


// Uncomment following line to debug value of database connectoin string
// console.log(process.env.DSN)
mongoose.connect(process.env.DSN)