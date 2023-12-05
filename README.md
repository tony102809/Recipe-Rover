The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.



# RecipeRover

## Overview
RecipeRover is a web application designed to simplify meal planning and recipe discovery. It allows users to come up with and save their own recipes. With RecipeRover, you can keep track of your favorite dishes and discover new culinary delights. Whether you're a seasoned chef or a kitchen novice, RecipeRover has something for everyone.

## Data Model
RecipeRover stores information about Users and the recipes they create. 

* Users can save recipes and make their own.
* Each recipe contains a title, ingredients and instructions.

An Example User:

```javascript
{
  username: "foodie123",
  hash: // a password hash,
  savedRecipes: // an array of references to Recipes,
  createdRecipes: // an array of references to Recipe documents
}

```

An Example Recipe:

```javascript
{
  title: "Pasta Carbonara",
  author: // a reference to a User object,
  ingredients: "Pasta, sauce, water, etc."
  instructions: "Step by step guide on how to cook the dish",
}

```

## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/Login and Registration - Pages that helps users register and log in
![Registration/Login](documentation/Login:Registration.JPG)

/Homepage - page that users see upon logging in
![welcome](documentation/HomeScreen.JPG)

/recipe/create - page for creating a new recipe 

![recipe create](documentation/recipe-create.JPG)

/list - page for showing all of user's recipes

![recipeLists](documentation/recipeLists.JPG)


## Site map
![sitemap](documentation/site-map.JPG)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new recipe
4. as a user, I can view all of the recipes I've created in a list
5. as a user, I modify my own recipes
6. as a user, I can view other people's recipes

## Research Topics
* (5 points) Integrate user authentication with Passport.js (Prof. said this was okay)
* (3 points) dotenv configuration


10 points total out of 10 required points 


## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)

