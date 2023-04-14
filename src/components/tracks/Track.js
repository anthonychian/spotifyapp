import React, { useState } from 'react'
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Pulse from 'react-reveal/Pulse';
import Flip from 'react-reveal/Flip';

export default function Track(props) {
    const [hover, setHover] = useState(false);
    function handleMouseHover() {
        setHover(!hover);
    }
    return (
        <div>
            <Flip top cascade>
            <ImageListItem 
                onMouseEnter={handleMouseHover}
                onMouseLeave={handleMouseHover}
                onClick={(e) => {
                    props.clickSong(e, {
                        name: props.track.name, 
                        artist: props.track.artist,
                        lyricsArtist: props.track.lyricsArtist, 
                        image: props.track.image,
                        imageHigh: props.track.imageHigh,
                        imageLow: props.track.imageLow,
                        position: props.track.position,
                        link: props.track.link
                    });
                }} 
                key = {props.track.id + '000' + props.idx}>
                
                    {hover && 
                        <div style={{ cursor: 'pointer' }}>
                            <Pulse>
                            <img
                                src={`${props.track.imageLow}`}
                                srcSet={`${props.track.image} 1x, ${props.track.imageHigh} 2x`}
                                height="auto"
                                width="100%"
                                alt={props.track.name}
                                longdesc={props.track.link}
                                loading="lazy"
                            />
                            </Pulse>
                        </div>
                    }
                    {!hover && <div style={{ cursor: 'pointer' }}>
                            <img
                                src={`${props.track.imageLow}`}
                                srcSet={`${props.track.image} 1x, ${props.track.imageHigh} 2x`}
                                height="auto"
                                width="100%"
                                alt={props.track.name}
                                longdesc={props.track.link}
                                loading="lazy"
                            />
                    </div>}
                

                <ImageListItemBar
                    title={props.track.name}         
                    subtitle={props.track.artist}
                    actionIcon={
                    <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${props.track.name}`}
                    >
                    </IconButton>
                    }
                />
            
            </ImageListItem>
            </Flip>
        </div>
    )
}
