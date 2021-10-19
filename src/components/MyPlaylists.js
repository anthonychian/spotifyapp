import React from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
    container: {
        // height: 'auto',
        marginTop: 200,
        
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
                <ImageListItem onClick={props.clickPlaylist} key={playlist.id}>
                    <div className={classes.imgContainer} >
                        <img
                            className={classes.img}
                            src={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format`}
                            // height="auto"
                            // width="100%"
                            srcSet={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={playlist.name}
                            loading="lazy"
                            longdesc={playlist.id}
                        />
                    </div>
                    <div className={classes.textContainer} >
                        <ImageListItemBar
                            title={playlist.name}         
                            subtitle={playlist.owner.display_name}
                            actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${playlist.name}`}
                            >
                            </IconButton>
                            }
                        />
                    </div>
                </ImageListItem>
            ))}
        </ImageList>
    )
}
