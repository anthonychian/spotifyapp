import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 3,
    width: 'auto',
    height: 'auto',
    padding: '1em',
    textAlign: 'center'
};


export default function ChatMessage({ message }) {
    const text = message.text
    const name = message.name
    const photoURL = message.photoURL

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar alt={name} src={photoURL} sx={{ width: 32, height: 32 }} />

                <div style={{ width: '10px' }}></div>
                <Typography sx={{ width: 'auto', fontWeight: "bold", fontSize: "0.9em", color: "gray" }}>{name}</Typography>

            </div>
            <Box sx={{ ...commonStyles, borderRadius: '16px' }} >
                <Typography sx={{ fontSize: "1em" }}>{text}</Typography>
            </Box>
        </div>
    )
}
