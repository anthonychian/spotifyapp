import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ListSubheader from '@mui/material/ListSubheader';
// import ImageListItemBar from '@mui/material/ImageListItemBar';
// import IconButton from '@mui/material/IconButton';
// import Pulse from 'react-reveal/Pulse';
import Track from './Track'


export default function MyTracks(props) {
    const [loading, setLoading] = useState(true);
    // const [hover, setHover] = useState(false);

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setLoading(false);
            },  1000);
            setLoading(true);
            return () => clearTimeout(timeoutID);
    }, [props.spinner]);

    // function handleMouseHover() {
    //     setHover(!hover);
    // }


    return (
        <div>
            <div 
                style={{
                display: loading ? "none" : "flex",
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '100px',
                height: "100%", 
                width: "100%"
            }}>
                
                <ImageList sx={{ width: '1', height: '1'  }} cols={3}>
                    <ImageListItem key="Subheader" cols={3}>
                        <ListSubheader component="div">{props.tracks.length} Songs</ListSubheader>
                    </ImageListItem>
                    {props.tracks.map((track, idx) => (
                        <Track track={track} idx={idx} clickSong={props.clickSong} /> 
                    ))}
                </ImageList>
               
            </div>
            <div 
                style={{
                display: loading ? "block" : "none",
                paddingTop: '10em',
                paddingBottom: '10em',
                }}>
                    <Stack sx={{ color: 'white' }} spacing={2} direction="row">
                        <CircularProgress color="inherit" />
                    </Stack>
            </div>
        </div>
    )
}
