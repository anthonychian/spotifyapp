import React from 'react'
import PlayerButtons from './PlayerButtons'
import MySlider from './MySlider'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    alignItemsAndJustifyContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cover: {
        marginTop: '10px',
        display: 'block',
        ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
            display: 'none'
        },
    },
    text: {
        position: 'relative', 
        display: 'runIn', 
        marginLeft: '1em',
        ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
            display: 'none', 
        },
    },
    player: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: '0'
    },
    bottomBar: {
        height: '11%',
        backgroundColor: '#191414!important',
        ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
            height: '17%',
        }
    },
  }));
  
export default function MyAppBar(props) {
    const classes = useStyles();

    return (
        <AppBar className={classes.bottomBar} sx={{ top: 'auto', bottom: 0}}>
        <Toolbar>
          <img className={classes.cover} alt= {props.nowPlaying.name} src={props.nowPlaying.imageHigh}/>
          <Typography variant="h7" component="div">
            <div className={classes.text}>
              <span style={{
                position: 'absolute', 
                width: '220px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.9em'}}> 
                  {props.nowPlaying.name}
              </span>
              <br/>
              <span style={{
                position: 'absolute', 
                width: '220px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'grey', 
                fontSize: '0.8em'}}> 
                  {props.nowPlaying.artist} 
              </span>
            </div>
          </Typography>
          <div className={classes.player}>
              <div>
                <PlayerButtons
                    paused={props.paused}
                    setPaused={props.setPaused}
                    setSkipSong={props.setSkipSong}
                    shuffle={props.shuffle}
                    setShuffle={props.setShuffle}
                    repeatSong={props.repeatSong}
                    setRepeatSong={props.setRepeatSong}
                />
                <MySlider
                    setCurrentPosition={props.setCurrentPosition}
                    currentPosition={props.currentPosition}
                    paused={props.paused}
                    currentTrack={props.currentTrack}
                    sliderPosition={props.sliderPosition}
                    setSliderPosition={props.setSliderPosition}
                />
                </div>
            </div>
           
          
          <div 
            style={{ position: 'absolute', height: '50px', right: '2%', width: '50px',cursor: 'pointer', marginLeft: 'auto'}} 
            onClick={props.clickScrollUp}>
            <div style={{position: 'absolute', paddingLeft: '50%', top: '40%'}}>
              <KeyboardArrowUpIcon />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    )
}
