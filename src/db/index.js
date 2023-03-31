const mongoose = require('mongoose');
const Recipe = require('./models/recipe.js');
const User = require('./models/user.js');

const opts = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}

module.exports = {
  startDB: ({ user, pwd, url, db, uri }) => {
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    })
    if (uri) {
      return mongoose.connect(uri, opts)
    }
    return mongoose.connect(`mongodb://${user}:${pwd}@${url}/${db}`, opts)
  },
  models: {
    Recipe,
    User
  },
}
