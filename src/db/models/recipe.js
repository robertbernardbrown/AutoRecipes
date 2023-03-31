const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  notes: { type: String },
  _user: { type: ObjectId },
  createdOn: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

recipeSchema.methods.updateRecipe = async function (params = {}) {
  const safeFields = ['title', 'description', 'duration', 'notes']
  for (let param in params) {
    if (safeFields.includes(param)) {
      this[param] = params[param]
    }
  }

  try {
    await this.save()
  } catch (err) {
    throw new Error('Error saving recipe')
  }

  return this
}

recipeSchema.statics.saveRecipe = async function ({ title, description, duration, notes, userId }) {
  if (!title || !description || !duration || !userId) {
    throw new Error('Missing required params')
  }
  const newRecipe = new Recipe({
    title,
    description,
    duration,
    _user: userId,
    notes
  })

  try {
    await newRecipe.save()
  } catch (e) {
    throw new Error('Error saving recipe')
  }

  return newRecipe
}

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
