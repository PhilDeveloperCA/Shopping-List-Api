const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
var morgan = require('morgan');

const AuthRoutes = require('./routes/auth');
const GroupRoutes = require('./routes/groups');
const app = express();
app.use(morgan('tiny'));

app.use(bodyParser.json());


app.use('/auth', AuthRoutes);
app.use('/group', GroupRoutes);

app.use('/', (req,res,next) => {
    res.json('Correct Page??');
})

app.listen(5000);