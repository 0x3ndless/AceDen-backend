const express = require('express');
const router = express.Router();

const User = require('../../models/User');

const authenticateToken = require('../../middleware/authenticateToken');



//Getting current user info
router.get('/me', authenticateToken, async (req, res) => {

  const userData = req.authData;
  const wallet = userData.verifiedAddress;

  try {
    const user = await User.findOne({ wallet }).sort({ date: -1 })
    .lean();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Not authorized');
  }
});




//Creating a user
router.post(
  '/',
  async (req, res) => {

    const { wallet } = req.body;

    try {
      let user = await User.findOne({ wallet });

      if (user) {
        return res
          .json({ exists: true });
      }


      user = new User({
        wallet
      });

      await user.save();
      res.json(user);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;
