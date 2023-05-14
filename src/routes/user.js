const router = require('express').Router();
const User = require('../db/models/user');

router.get('/', async (req, res) => {
  let user;
  try {
    user = await User.find({ userId: req.session.userId })
    return res.json(user);
  } catch (err) {
    return res.status(400).json('Error: ' + err.message)
  }
});

module.exports = router;