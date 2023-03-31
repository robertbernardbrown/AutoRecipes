const config = require('dotenv').config().parsed;
const router = require('express').Router();
const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = config.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

router.route('/').get(async (req, res) => {
    let ingredients = req.query.ingredients;
    ingredients = ingredients.split(',').join(' and ')
    const amount = req.query.amount && Math.floor(req.query.amount);
    const recipeOrRecipes = amount > 1 ? 'recipes' : 'recipe';
    const space = ' ';
    let prompt = `Can you provide ${amount} ${recipeOrRecipes} using ${ingredients} and minimal other ingredients?`;
    prompt = prompt + space + 'Provide the answer as a stringified JSON object with title, ingredients, and recipe split into their own properties.';
    prompt = prompt + space + 'Organize the ingredient list into an array of items.';
    prompt = prompt + space + 'Organize the recipe into a numbered list of steps and signify line breaks between the steps using "//n". Do not break the recipe steps onto their own lines.';
    prompt = prompt + space + 'End each recipe with the phrase "Bon appetite!"';
    let response;
    try {
      response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        n: 1,
        max_tokens: 500,
        temperature: 1
      });
    } catch (err) {
      console.log(err);
      return res.send('Error');
    }
    const recipe = response.data.choices[0].text.trim();
    const parsedRecipe = JSON.parse(recipe);
    return res.send(parsedRecipe);
});

module.exports = router;
