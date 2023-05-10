import React from 'react'
import PlayerButtons from './PlayerButtons'
import MySlider from './MySlider'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import GroupsIcon from '@mui/icons-material/Groups';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  alignItemsAndJustifyContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    marginTop: '10px',
    height: '5em',
    width: '5em',
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
  groupIconStyle: {
    position: 'absolute', height: '50px',
    
    ['@media (min-width:1000px)']: { right: '2%',}, // eslint-disable-line no-useless-computed-key
    width: '50px', cursor: 'pointer', marginLeft: 'auto',
  },
}));

export default function MyAppBar(props) {
  const classes = useStyles();

  return (
    <AppBar className={classes.bottomBar} sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <img className={classes.cover} alt={props.nowPlaying.name} src={props.nowPlaying.imageLow} />
        <Typography variant="h7" component="div">
          <div className={classes.text}>
            <span style={{
              position: 'absolute',
              width: '220px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '0.9em'
            }}>
              {props.nowPlaying.name}
            </span>
            <br />
            <span style={{
              position: 'absolute',
              width: '220px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'grey',
              fontSize: '0.8em'
            }}>
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

        <div style={{ position: 'absolute', height: '50px', right: '10%', width: '50px', marginLeft: 'auto' }}>
          {props.switchOn ?
            <Tooltip
              title={'Chat'} 
              placement="left"
              arrow>
                <IconButton>
                    <GroupsIcon
                        sx={{ color: 'blue' }}
                        onClick={props.handleDrawerOpen}>Open</GroupsIcon>
                </IconButton>
            </Tooltip> :
            <IconButton disabled={true}>
              <GroupsIcon sx={{ color: 'white' }}>Open</GroupsIcon>
            </IconButton>
          }
        </div>

        <div className={classes.groupIconStyle}>
          <Tooltip
            title={props.switchOn ? 'Disable Live Session' : 'Enable Live Session'}
            arrow>
            <FormControlLabel control={<Switch onChange={props.handleSwitch} />} label="" />
          </Tooltip>
        </div>

        {/* <div
          style={{ position: 'absolute', height: '50px', right: '2%', width: '50px', cursor: 'pointer', marginLeft: 'auto' }}
          onClick={props.clickScrollUp}>
          <div style={{ position: 'absolute', paddingLeft: '50%', top: '40%' }}>
            <KeyboardArrowUpIcon />
          </div>
        </div> */}
      </Toolbar>
    </AppBar>
  )
}
