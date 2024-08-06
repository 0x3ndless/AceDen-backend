const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
require('dotenv').config();

const cors = require("cors");


const app = express();

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb'}));


// Connect Database
connectDB();


const corsOptions ={
  origin:'*', 
  credentials:true,  //access-control-allow-credentials:true
  optionSuccessStatus:200,
}


// Init Middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req,res) => {
  res.json({"AceDen": "P2P Betting"});
})

//routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
