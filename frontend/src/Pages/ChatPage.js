import React, { useEffect, useState } from 'react'

import axios from 'axios';

const ChatPage = () => {

  const [chats, setChats] = useState([])

  const fetchChats = async () => {
    try {
      const data = await axios.get('/api/chats');
      setChats(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchChats();
  }, [])

  return (
    <>
      <div>ChatPage</div>
      {chats.map((chat) => <div key={chat._id}>{chat.chatName}</div>)}
    </>
  )
}

export default ChatPage 