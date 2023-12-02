app.get('/my-recipes', isLoggedIn, async (req, res) => {
  try {
    const recipes = await Recipe.find({ _id: { $in: req.user.savedRecipes } });
    res.render('my-recipes', { user: req.user, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});