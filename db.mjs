import mongoose from 'mongoose';

// User Schema
const user = new mongoose.Schema({
  username: String,
  password: String,
  savedRecipes: [String],
  createdRecipes: [String],
});

// Recipe Schema
const recipe = new mongoose.Schema({
  title: String,
  author: String,
  ingredients: [
    {
      name: String,
      quantity: String ,
    },
  ],
  instructions: String,
});


export const User = mongoose.model('User', user);
export const Recipe = mongoose.model('Recipe', recipe);

