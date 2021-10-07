import React, { useState, useEffect } from 'react'
import MyCircularColor from './MyCircularColor'

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';

export default function MyTracks(props) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setLoading(false);
            },  1000);
            return () => clearTimeout(timeoutID);
    });


    return (
        <div>
            <div 
                style={{
                display: loading ? "none" : "flex",
                alignItems: 'center',
                justifyContent: 'center',
                height: "100%", 
                width: "100%"
            }}>
                <ImageList sx={{ width: 1000, height: 1000  }}>
                    <ImageListItem key="Subheader" cols={3}>
                        <ListSubheader component="div">{props.tracks.length} Songs</ListSubheader>
                    </ImageListItem>
                    {props.tracks.map((track, idx) => (
                        <ImageListItem onClick={(e) => {
                            props.clickSong(e, {name: track.name, artist: track.artist, image: track.image});}} 
                            key = {track.id + '000' + idx}>
                            <a href={track.link}>
                            <img
                                src={`${track.image}?w=248&fit=crop&auto=format`}
                                srcSet={`${track.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={track.name}
                                longdesc={track.link}
                                loading="lazy"
                            />
                            </a>
                            <ImageListItemBar
                                title={track.name}         
                                subtitle={track.artist}
                                actionIcon={
                                <IconButton
                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`info about ${track.name}`}
                                >
                                </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <div 
                style={{
                display: loading ? "block" : "none",
                }}>
                    <MyCircularColor/>
            </div>
        </div>
    )
}
