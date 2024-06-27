const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const groupMemberRoutes = require('./routes/groupMember');
const messageRoutes = require('./routes/message');
const sequelize = require('./util/database');
const cors = require('cors');

const User = require('./models/User');
const Group = require('./models/Group');
const GroupMember = require('./models/GroupMember');
const Message = require('./models/Message');


const app = express();

dotenv.config();

app.use(cors({
    origin: "*",
    credentials: true,
})
);

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/groups', groupRoutes);
app.use('/groupMembers', groupMemberRoutes);
app.use('/messages', messageRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup', 'signup.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

app.get('/ChatApp/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ChatApp', 'index.html'));
});

const models = { User, Group, GroupMember, Message };
User.associate(models);
Group.associate(models);
GroupMember.associate(models);

sequelize
.sync({force: true})
.then(async () => {
    await User.sync();
    await Group.sync();
    await GroupMember.sync();
    await Message.sync();
    app.listen(7000);
}).catch(err => {
     console.log(err);
});
