const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
var morgan = require('morgan');

const AuthRoutes = require('./routes/auth');
const GroupRoutes = require('./routes/groups');
const listRoutes = require('./routes/shoppinglist');
const ItemRoutes = require('./routes/items');

const AppRoutes = require('./routes2/groups');
const InviteRoutes = require('./routes2/invite');

const cors = require('cors');
const handleErrors = require('./utils/handleErrors');

const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(cors({
    credentials:true,
}));

app.use('/app/group', (req,res,next) => {console.log('here'); next()}, AppRoutes);
app.use('/app/invite', InviteRoutes);

app.use('/auth', AuthRoutes);
app.use('/group', GroupRoutes);
app.use('/lists', listRoutes);
app.use('/items', ItemRoutes);

app.use(handleErrors);

app.listen(5000);