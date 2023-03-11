const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const config = require('dotenv').config().parsed;

const OPENAI_API_KEY = config.OPENAI_API_KEY;

const configuration = new Configuration({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const PORT = process.env.PORT || 5000;

app.get('/recipes/:amount/:ingredients', async (req, res) => {
  let ingredients = req.params.ingredients;
  ingredients = ingredients.split(',').join(' and ')
  const amount = req.params.amount && Math.floor(req.params.amount);
  const recipeOrRecipes = amount > 1 ? 'recipes' : 'recipe';
  const prompt = `Can you provide ${amount} ${recipeOrRecipes} using ${ingredients} and minimal other ingredients?`;
  let response;
  try {
    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      n: 1,
      max_tokens: 250,
      temperature: 1
    });
  } catch (err) {
    console.log(err);
    return res.send('Error');
  }
  const recipe = response.data.choices[0].text.trim();
  res.send(recipe);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
