require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

// APP SETUP
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE
if (process.env.NODE_ENV === 'production') {
    // const user = process.env.DB_USER,
    // const pwd = process.env.DB_PASS,
    // const url = process.env.DB_NAME,
    // const db = process.env.DB_URL,
    // db.startDB({ user, pwd, url, db })
} else {
  db.startDB({ uri: 'mongodb://localhost:27017/env_development' })
}

const cookingRouter = require('./routes/cooking');
const recipeRouter = require('./routes/recipe');
const userRouter = require('./routes/user');

// ROUTES
app.use('/cooking', cookingRouter);
app.use('/recipes', recipeRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
