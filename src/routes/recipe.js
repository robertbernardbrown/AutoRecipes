const router = require('express').Router();
const Recipe = require('../db/models/recipe');

router.route('/').get(async (req, res) => {
  let recipes;
  try {
    recipes = await Recipe.find({ userId: req.session.userId })
    return res.json(recipes);
  } catch (err) {
    return res.status(400).json('Error: ' + err.message)
  }
});

router.route('/add').post(async (req, res) => {
  const title = String(req.body.title);
  const description = String(req.body.description);
  const duration = parseInt(req.body.duration);
  const notes = String(req.body.notes);
  const userId = req.session.userId;
  let newRecipe;

  try {
    newRecipe = await Recipe.saveRecipe({
      title,
      description,
      duration,
      _user: userId,
      notes
    })
    return res.json(newRecipe)
  } catch (err) {
    return res.status(400).json('Error: ' + err.message)
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    return res.json(recipe);
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').delete(async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    return res.json('Recipe deleted.');
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

router.route('/update/:id').post(async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    recipe = recipe.updateRecipe({
      title: String(req.body.title),
      description: String(req.body.description),
      duration: parseInt(req.body.duration),
      notes: String(req.body.notes)
    });
    return res.json(recipe);
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
