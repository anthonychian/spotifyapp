import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

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
    const date = message.createdAt

    return (
        <div style={{ width: '100%' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar alt={name} src={photoURL} sx={{ width: 32, height: 32 }} />
                <div>
                    <Typography sx={{ textAlign: 'center', fontWeight: "bold", fontSize: "0.9em", color: "white" }}>{name}</Typography>
                    <Box sx={{ ...commonStyles, borderRadius: '16px' }} >
                        <Tooltip
                            PopperProps={{
                                modifiers: [{name: "offset", options: {offset: [0, 15]}}]
                            }}
                            title={date?.toDate().toLocaleString('en-US', { weekday: "short", hour: "numeric", minute: "numeric", timeZone: 'PST' })} 
                            placement="right"
                            arrow>
                            <Typography sx={{ fontSize: "1em"}}>{text}</Typography>
                        </Tooltip>
                    </Box>
                </div>
            </div>
        </div>
    )
}
