//require then use express
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001; //Heroku-approved port declaration

//set up middlewares for later use by application
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json()); //have a parse JSON as well

//Set up possible route names, defined in a seperate file.
require('./routes/api')(app);
require('./routes/html')(app);

//Listen to the port so the server will 
app.listen(PORT, () => {
    console.log(`Server available at localhost${PORT}`);
  });
