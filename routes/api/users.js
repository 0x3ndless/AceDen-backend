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


router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ total_bets: -1 })
      .limit(100)
      .lean(); 

    const leaderboard = topUsers.map((user, index) => ({
        rank: index + 1,
        total_bets: user.total_bets,
        wallet: user.wallet,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
