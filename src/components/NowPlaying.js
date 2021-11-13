import React from 'react'
import Lyrics from "./Lyrics";
import { Palette } from 'react-palette';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
    coverImg: {
        ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
          width: '90%',
        },
        ['@media (min-width:480px)']: { // eslint-disable-line no-useless-computed-key
            width: 417.59,
        },
        ['@media (min-width:1282px)']: { // eslint-disable-line no-useless-computed-key
            width: '33%',
        },
      }
  }))


export default function NowPlaying(props) {

    const classes = useStyles()

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
                    props.changeColor(data.vibrant)
                )}
            </Palette>
            {/* <ImageListItem sx={{ width: '30%', height: 'auto' }}> */}
            <ImageListItem className={classes.coverImg}>
                <img 
                    src={`${props.nowPlaying.image}`}
                    srcSet={`${props.nowPlaying.imageHigh} 1x`}
                    alt={props.nowPlaying.name}
                    loading="lazy"
                />
                
                <ImageListItemBar
                    title={props.nowPlaying.name}         
                    subtitle={props.nowPlaying.artist}
                    actionIcon={
                        <Lyrics name={props.nowPlaying.name} lyrics={props.lyrics}/>
                    }
                />
            </ImageListItem>
        </div>
    )
}

