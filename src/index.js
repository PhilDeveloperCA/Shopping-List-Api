const express = require('express');
let morgan = require('morgan');


const ItemRoutes = require('./routes/items');

const GroupRoutes = require('./routes/groups');
const AuthRoutes = require('./routes/auth');
const InviteRoutes = require('./routes/invite');
const listRoutes = require('./routes/lists');
const userRoutes = require('./routes/users');

const cors = require('cors');
const handleErrors = require('./utils/handleErrors');

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

app.use(cors({
    credentials:true,
}));

app.use('/api/auth', AuthRoutes);
app.use('/api/group', GroupRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/items', ItemRoutes);
app.use('/api/invite', InviteRoutes);
app.use('/api/users', userRoutes);

app.use(handleErrors);

app.listen(5000);