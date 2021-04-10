const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
var morgan = require('morgan');

const AuthRoutes = require('./routes/auth');
const GroupRoutes = require('./routes/groups');
const listRoutes = require('./routes/shoppinglist');
const ItemRoutes = require('./routes/items');
const cors = require('cors');

const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(cors({
    credentials:true,
}));

app.use('/auth', AuthRoutes);
app.use('/group', GroupRoutes);
app.use('/lists', listRoutes);
app.use('/items', ItemRoutes);

app.listen(5000);