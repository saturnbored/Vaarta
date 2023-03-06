const asyncHandler = require('express-async-handler');
const { update } = require('../models/chatModel');
const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');

// controller for fetching a 1v1 chat
const accessChat = asyncHandler(async (req, res) => {
    const {userId} = req.body;

    if(!userId) {
        console.log('User id param not sent with request.');
        return res.status(400);
    }
    
    try {
        
        let chat = await chatModel.find({
            isGroupChat: false,
            $and: [
                {users: {
                    $elemMatch: {
                        $eq: req.user._id
                    }
                }},
                {users: {
                    $elemMatch: {
                        $eq: userId
                    }
                }},
            ],
        })
        .populate('users', '-password')
        .populate('latestMessage');

        chat = await userModel.populate(chat, {
            path: 'latestMessage.sender',
            select: 'name pic email',
        });

        if(chat.length === 0) {
            let chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            const createdChat = await chatModel.create(chatData);
            chat = chatModel.find({
                _id: createdChat._id
            }).populate('users', '-password');
        }

        return res.status(200).json(chat[0]);

    } catch (error) {
        console.log(error.message);
        res.status(500);
        throw new Error('Some error occurred. Could not create the chat.');
    }
});

// controller for fetching all the chats of a user
const fetchChats = asyncHandler(async (req, res) => {
    try {
        let allChats = await chatModel.find({
            users: { $elemMatch: {$eq: req.user._id}}
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1});

        allChats = await userModel.populate(allChats, {
            path: 'latestMessage.sender',
            select: 'name pic email',
        });

        return res.status(200).json(allChats);

    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

// controller for creating a group chat
const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({
            message: 'Please fill all the fields.',
        });
    }

    let users = JSON.parse(req.body.users);

    if( users.length < 2) { // a group chat should have minimum 3 participants
        return res.status(400).send({
            message: 'Please add more users.',
        });
    }

    users.push(req.user);

    try {
        const groupChatData = {
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        };

        const createdChat = await chatModel.create(groupChatData);

        const groupChat = await chatModel.findOne({_id: createdChat._id})
        .populate('users', '-password')
        .populate( 'groupAdmin', '-password');

        return res.status(201).json(groupChat);

    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

// controller for renaming a group chat
const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    if(!chatId || !chatName){
        return res.status(400).send('Bad request.');
    }

    try {
        const updatedChat = await chatModel.findByIdAndUpdate(chatId,{
            chatName: chatName
        },
        {
            new: true,
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
        
        if(!updatedChat) {
            return res.status(404).send('Chat was not found');
        }
        return res.status(200).json(updatedChat);
    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

// controller for removing user from a group chat
const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId, userId} = req.body;
    
    if(!userId || !chatId) {
        return res.status(400).send('Bad request.');
    }

    try {
        const updatedChat = await chatModel.findByIdAndUpdate(chatId, {
            $pull: {users: userId},
        }, {
            new : true,
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

        if(!updatedChat) {
            res.status(404);
            throw new Error('Chat not found.');
        }

        return res.status(200).json(updatedChat);        
    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

// controller for adding someone to a group chat
const addToGroup = asyncHandler(async (req, res) => {
    const {chatId, userId}  = req.body;

    if(!chatId || !userId) {
        return res.status(400).send('Bad request');
    }

    try {
        
        const updatedChat = await chatModel.findByIdAndUpdate(chatId, {
            $push: {users: userId},
        }, {
            new: true,
        })
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

        if(!updatedChat) {
            res.status(404);
            throw new Error('Chat not found');
        }

        return res.status(200).json(updatedChat);

    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroupChat,
    removeFromGroup,
    addToGroup
}