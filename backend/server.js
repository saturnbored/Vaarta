const express = require('express');
const {chats} = require('./data/data');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {connectDB} = require('./config/db');
const {notFound, errorHandler} = require('./middlewares/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('API is running.');
// });

// app.get('/api/chats', (req, res) => {
//     res.send(chats);
// });

app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));




