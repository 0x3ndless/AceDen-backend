const express = require('express');
const jwt = require('jsonwebtoken');
const Web3 = require('web3'); 
const router = express.Router();
const crypto = require('crypto');

const web3 = new Web3('https://cloudflare-eth.com/');
const jwtSecret = process.env.SECRET_JWT



router.get('/nonce', (req,res) => {

    const nonce = crypto.randomUUID();
    const address = req.query.address //querying wallet address from header
   
    const tempToken = jwt.sign({nonce, address}, jwtSecret, { expiresIn: '60s'})
    const message = getSignMessage(address, nonce)
    
    res.json({tempToken, message})
   })
   


router.post('/verify', async (req,res) => {
    const authHeader = req.headers['authorization']
    const tempToken = authHeader && authHeader.split(" ")[1]
  
    if (tempToken === null) return res.sendStatus(403);

    try {
  
    const userData = await jwt.verify(tempToken, jwtSecret)
    const nonce = userData.nonce
    const address = userData.address
    const message = getSignMessage(address, nonce)
    const signature = req.query.signature
  
    const verifiedAddress = await web3.eth.accounts.recover(message, signature)
  
    if(verifiedAddress.toLowerCase() == address.toLowerCase()) {
      const token = jwt.sign({verifiedAddress}, jwtSecret, {expiresIn: '1d'})
      res.json({token})
    } else {
      res.sendStatus(403)
    }
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ error: 'Temporary token expired!', code: 404 });
  }
  })
  
  
  const getSignMessage = (address, nonce) => {
    return `Welcome to AceDen!\n\nClick to sign in and accept the AceDen Terms of Service\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${address}\n\nNonce:\n${nonce}`
  }


  
module.exports = router;
