require('dotenv').config();

// set up
const express = require('express');
const sequelize = require('./db');
const bodyParser = require('body-parser');
const app = express();

// controllers
const pies = require('./controllers/piecontroller');
const user = require('./controllers/usercontroller');


app.use(require('./middleware/headers'));
app.listen(process.env.PORT, () => console.log(`Pies are baking on ${process.env.PORT}`));
app.use(bodyParser.json());
sequelize.sync();

app.use(express.static(__dirname + '/public'));
// console.log(__dirname);

app.get('/', (req, res) => res.render('index'));

app.use('/pies', pies);
app.use('/auth', user);