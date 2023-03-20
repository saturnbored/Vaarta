const asyncHandler = require("express-async-handler");

const messageModel = require('../models/messageModel');
const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
     try {
        const {content, chatId} = req.body;

        if(!content || !chatId){
            console.log('Invalid data passed into request');
            return res.sendStatus(400);
        }

        let message = {
            sender: req.user._id,
            content: content,
            chat: chatId
        };

        message = await messageModel.create(message);

        message = await message.populate([
            {
                path: 'sender',
                select: 'name pic',
            },
            'chat',
        ]);

        message = await userModel.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });

        await chatModel.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });     

        res.json(message);

     } catch (error) {
        console.log(error.message);
     }
});

const allMessages = asyncHandler(async(req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await messageModel.find({chat: chatId})
        .populate('sender', 'name pic email')
        .populate('chat');
        res.json(messages);

    } catch (error) {
        console.log(error.message);
    }
});


module.exports = {
    sendMessage,
    allMessages
}