import React from 'react'
import Playlist from './Playlist'
import ImageList from '@mui/material/ImageList';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
    container: {
        // height: 'auto',
        marginTop: "5em",
        marginBottom: "5em",
        
        // ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
        // //   width: '92vw',
        // },
        // ['@media (max-height:780px)']: { // eslint-disable-line no-useless-computed-key
        //     marginTop: 400,
            
        // },
        // ['@media (min-height:780px)']: { // eslint-disable-line no-useless-computed-key
        //     marginTop: 200,
        //     // width: 687.59
        // },
    }
  }))

export default function MyPlaylists(props) {
    const classes = useStyles()

    return (
        <ImageList className={classes.container} cols={3}>
            {props.playlists.map((playlist, idx) => (
                <Playlist playlist={playlist} 
                    key={idx}
                    clickPlaylist={props.clickPlaylist} 
                    currentPlaylistName={props.currentPlaylistName} 
                    clickPlaylistPlayButton={props.clickPlaylistPlayButton} 
                />
            ))}
        </ImageList>
    )
}
