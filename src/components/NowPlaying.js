import React from 'react'

import { Palette } from 'react-palette';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';


export default function NowPlaying(props) {
    return (
        <div 
            style={{
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            height: "100%", 
            width: "100%"

        }}>
            <Palette src={props.nowPlaying.image}>
                {({ data, loading, error }) => (
                    props.setCurrentColor(data.vibrant)
                )}
            </Palette>
            <ImageListItem sx={{ width: '30%', height: 'auto' }}>
                <img 
                    src={`${props.nowPlaying.image}?w=248&fit=crop&auto=format`}
                    srcSet={`${props.nowPlaying.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={props.nowPlaying.name}
                    loading="lazy"
                />
                
                <ImageListItemBar
                    title={props.nowPlaying.name}         
                    subtitle={props.nowPlaying.artist}
                    actionIcon={
                    <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${props.nowPlaying.name}`}
                    >
                    </IconButton>
                    }
                />
            </ImageListItem>
        </div>
    )
}

