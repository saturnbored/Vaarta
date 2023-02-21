const express = require('express');
const {chats} = require('./data/data');

const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('API is running.');
});

app.get('/api/chats', (req, res) => {
    res.send(chats);
});

app.get('/api/chats/:id', (req, res) => {
    const singleChat = chats.find((item) => {
        return item._id === req.params.id;
    });
    res.send(singleChat);  
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));




