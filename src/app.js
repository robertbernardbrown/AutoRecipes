require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const passport = require('passport');
const session = require('express-session');

const userRouter = require('./routes/user');
const cookingRouter = require('./routes/cooking');
const recipeRouter = require('./routes/recipe');
const {
  authRouter,
  helpers: { requireAuth }
} = require('./routes/authentication');

// APP SETUP
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);

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

// ROUTES
// user routes defined before functionality to ensure auth
app.use('/users', requireAuth, userRouter);
// functionality routes
app.use('/cooking', requireAuth, cookingRouter);
app.use('/recipes', requireAuth, recipeRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
