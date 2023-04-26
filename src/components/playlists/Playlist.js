import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';


const useStyles = makeStyles(theme => ({
    textContainer: {
        height: "auto",
        width: "auto",
    },
    imgContainer: {
        overflow: 'hidden',
        height: "20vw",
        width: "20vw",
        cursor: 'pointer',
        ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
            width: '30vw',
            height: '30vw',
        },
        
    },
    imgContainerClicked: {
        overflow: 'hidden',
        height: "20vw",
        width: "20vw",
        cursor: 'cursor',
        ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
            width: '30vw',
            height: '30vw',
        },
        
    },
    img: {
        height: "100%",
        minWidth: "100%",
    }
  }))
  

export default function Playlist(props) {
    
  const classes = useStyles();

  return (
    <div>
        <ImageListItem 
            onClick={(e) => {
            props.clickPlaylist(e, props.playlist.uri)}} 
            key={props.playlist.id}>
            {(props.playlist.name !== props.currentPlaylistName) && 
            <div className={classes.imgContainer}>
                <img
                    className={classes.img}
                    src={`${props.playlist.images[0]?.url}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${props.playlist.images[0]?.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={props.playlist.name}
                    loading="lazy"
                    longdesc={props.playlist.id}
                />
            </div>}
            {(props.playlist.name === props.currentPlaylistName) && 
            <div className={classes.imgContainerClicked}>
                <img
                    className={classes.img}
                    src={`${props.playlist.images[0].url}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${props.playlist.images[0].url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={props.playlist.name}
                    loading="lazy"
                    longdesc={props.playlist.id}
                />
            </div>}
            <div className={classes.textContainer} >
                <ImageListItemBar
                    title={props.playlist.name}         
                    subtitle={props.playlist.owner.display_name}
                    actionIcon={
                    <IconButton
                        sx={{ color: 'white' }}
                        aria-label={`${props.playlist.name}`}
                        onClick={() => {
                            props.clickPlaylistPlayButton(props.playlist.uri, props.playlist.name)
                        }}
                    >
                        <PlayCircleOutlineIcon/>
                    </IconButton>
                    }
                />
            </div>
        </ImageListItem>
    </div>
  )
}
