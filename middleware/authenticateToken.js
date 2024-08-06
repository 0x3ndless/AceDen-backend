
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET_JWT


//middleware to authenticate token
function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if(token == null) return res.sendStatus(401)
  
    jwt.verify(token, jwtSecret, (err, authData) => {
  
      if(err) return res.sendStatus(403)
      req.authData = authData
  
      next()
  
    })
  }


  module.exports = authenticateToken;