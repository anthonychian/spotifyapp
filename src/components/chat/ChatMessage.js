import React from 'react'
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 3,
    width: 'auto',
    height: 'auto',
};


export default function ChatMessage({message}) {
    const text = message.text
    const name = message.name
    const photoURL = message.photoURL

    return (
        <div>
            <Avatar alt={name} src={photoURL} sx={{ width: 32, height: 32}}></Avatar>
            <div style={{ textAlign: 'center'}}>
                <Typography sx={{ fontWeight: "bold", fontSize:"0.9em", color: "gray", minWidth: 100, pr: 0}}>{name}</Typography>
                <Box sx={{ ...commonStyles, borderRadius: '16px' }} >
                    <p>{text}</p>
                </Box>
            </div>
        </div>
    )
}
