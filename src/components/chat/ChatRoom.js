import React, { useState, useEffect } from 'react'
import ChatMessage from './ChatMessage';

import { collection, query, getDocs } from "firebase/firestore";



export default function ChatRoom(props) {

    // async function getMessages() {
        
    //     const messagesCol = collection(props.db, 'messages');
    //     console.log(messagesCol)
    //     const messagesSnapshot = await getDocs(messagesCol);
    //     console.log(messagesSnapshot)
    //     // const messages = messagesSnapshot.docs.map(doc => doc.data());
    //     return messagesSnapshot
    // }
    // const msg = getMessages()
    // const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages, setMessages] = useState([])
    
    useEffect(() => {
        async function getMessages() {
            const q = query(collection(props.db, "messages"));
            const querySnapshot = await getDocs(q);
            let messages = []
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            });
            setMessages(messages)
        }
        getMessages()
    },[])

    
    return (
        <div>
            {messages && messages.map((message, idx) => (
                <ChatMessage key={idx} message={message} />
            ))}
        </div>
    )
}
