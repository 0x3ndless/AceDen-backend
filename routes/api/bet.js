const express = require('express');
const router = express.Router();


const Bet = require('../../models/Bet');
const User = require('../../models/User');
const authenticateToken = require('../../middleware/authenticateToken');



// Get all active bets
router.get('/all/active', async (req, res) => {
    try {

      const activeBets = await Bet.find({ isSettled: false }).lean();
  
      // Sort bets by date in descending order
      activeBets.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.status(200).json(activeBets);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Unable to fetch active bets!', code: 500 });
    }
});
  


//Getting all the completed bets by the user
router.get("/me/completed", authenticateToken, async (req, res) => {

    const userData = req.authData;
    const wallet = userData.verifiedAddress;

    try {
      var bet = await Bet.find({
        creator: wallet,
        isSettled: true,
      }).lean();

      bet.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.status(200).json(bet);
    } catch (err) {
      res.status(500).json(err);
    }
});


// Getting all the active bets by the user
router.get("/me/active", authenticateToken, async (req, res) => {

    const userData = req.authData;
    const wallet = userData.verifiedAddress;
  
    try {
        var bet = await Bet.find({
            creator: wallet,
            isSettled: false,
        }).lean();

        bet.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.status(200).json(bet);
    } catch (err) {
      res.status(500).json(err);
    }
});



//---------------------------------------------------------------------------------------------------------------------

//Getting bet details using ID
router.get('/:id', async (req, res) => {

  const betId = req.params.id;

  try {
    const betContent = await Bet.findOne({ _id: betId }).lean();

    if (!betContent) {
      return res.status(404).json({ error: 'Bet not found', code: 404 });
    }

    res.json({betContent, code: 200});
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ error: 'Bet not found or not active', code: 404 });
  }
});

  
//---------------------------------------------------------------------------------------------------------------------
//Creating a bet
router.post(
  '/new', authenticateToken,
  async (req, res) => {

    const userData = req.authData;
    const wallet = userData.verifiedAddress;

    const { betId, bet_amount, targetPrice, endTime, joinUntill, creatorPrediction, assetType } = req.body;

    try {

        betContent = new Bet({
          betId: betId,
          creator: wallet,
          bet_amount: bet_amount,
          targetPrice: targetPrice,
          endTime: endTime,
          joinUntill: joinUntill,
          creatorPrediction: creatorPrediction,
          assetType: assetType,
      });

      await betContent.save();

      // Increment total_bets for the user
      await User.findOneAndUpdate(
        { wallet: wallet },
        { $inc: { total_bets: 1 } },
      );

      res.json(betContent);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Unable to create a bet!');
    }
  }
);



//---------------------------------------------------------------------------------------------------------------------
// Delete a bet
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  const betId = req.params.id;
  const userData = req.authData;
  const wallet = userData.verifiedAddress;

  try {
    // Find the bet by id
    const bet = await Bet.findOne({ _id: req.params.id });

    if (!bet) {
      return res.status(404).json({ error: 'Bet not found.' });
    }

    if (wallet !== bet.creator) {
      return res.status(401).json({ msg: 'Authorization denied' });
    }

    if (bet.opponent !== null) {
      return res.status(401).json({ msg: 'Bet cannot be deleted once joined', code: 401 });
    }

    await Bet.findByIdAndDelete(betId);

    const remainingBet = await Bet.find({ creator: wallet }).lean();
    res.status(200).json(remainingBet);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Unable to delete the bet content!', code: 500 });
  }
});


//---------------------------------------------------------------------------------------------------------------------
//Updating the bet content
router.put('/update/:id', authenticateToken, async (req, res) => {

    const betId = req.params.id
    let betContent = await Bet.findById(betId);

    if (!betContent) {
      return res.status(404).json({ msg: 'Bet not found' });
    }

  try {

    const { isSettled, isDraw, creatorWins, rewardClaimed } = req.body;

      betContent.set({
        isSettled,
        isDraw,
        creatorWins,
        rewardClaimed,
      });

      await betContent.save();
      res.json(betContent)

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Unable to update the bet!', code: 500 });
  }
}
);


//---------------------------------------------------------------------------------------------------------------------
//Join the bet
router.put('/join/:id', authenticateToken, async (req, res) => {

    const betId = req.params.id
    let betContent = await Bet.findById(betId);

    if (!betContent) {
      return res.status(404).json({ msg: 'Bet not found' });
    }

    if (betContent.opponent !== null) {
        return res.status(404).json({ msg: 'Bet already joined' });
    }

    
    const userData = req.authData;
    const wallet = userData.verifiedAddress;

  try {
    
      betContent.set({
        opponent: wallet
      });

      await betContent.save();
      res.json(betContent)

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Unable to join the bet!', code: 500 });
  }
}
);



//---------------------------------------------------------------------------------------------------------------------

module.exports = router;