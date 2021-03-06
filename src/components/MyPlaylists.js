import React from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
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
    },
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

export default function MyPlaylists(props) {
    const classes = useStyles()

    return (
        <ImageList className={classes.container} cols={3}>
            {props.playlists.map((playlist) => (
                <ImageListItem 
                // onClick= {props.clickPlaylist} key={playlist.id}
                onClick={(e) => {
                    props.clickPlaylist(e, playlist.uri)
                }} key={playlist.id}>
                    {(playlist.name !== props.currentPlaylistName) && 
                    <div className={classes.imgContainer}>
                        <img
                            className={classes.img}
                            src={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={playlist.name}
                            loading="lazy"
                            longdesc={playlist.id}
                        />
                    </div>}
                    {(playlist.name === props.currentPlaylistName) && 
                    <div className={classes.imgContainerClicked}>
                        <img
                            className={classes.img}
                            src={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={playlist.name}
                            loading="lazy"
                            longdesc={playlist.id}
                        />
                    </div>}
                    <div className={classes.textContainer} >
                        <ImageListItemBar
                            title={playlist.name}         
                            subtitle={playlist.owner.display_name}
                            actionIcon={
                            <IconButton
                                sx={{ color: 'white' }}
                                aria-label={`${playlist.name}`}
                                onClick={() => {
                                    props.clickPlaylistPlayButton(playlist.uri, playlist.name)
                                }}
                            >
                                <PlayCircleOutlineIcon/>
                            </IconButton>
                            }
                        />
                    </div>
                </ImageListItem>
            ))}
        </ImageList>
    )
}
