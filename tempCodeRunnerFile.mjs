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