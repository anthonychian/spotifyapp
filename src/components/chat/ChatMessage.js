import React from 'react'

export default function ChatMessage({ message }) {
    const { text } = message.text
    console.log(text)
    return (
        <p>{text}</p>
    )
}
