import React from 'react'
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';

const mainIconColor = 'white'
export default function PlayerButtons(props) {
    return (
        <div style={{"zIndex": "5"}}>
            <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="next song"
                onClick={() => props.setShuffle({
                  shuffle: !props.shuffle.shuffle,
                  clicked: true
                })}>
                  {props.shuffle.shuffle ? (
                    <ShuffleOnIcon 
                      sx={{ fontSize: '1.5rem' }}
                      htmlColor={mainIconColor}
                    />
                    ) : (
                    <ShuffleIcon 
                      sx={{ fontSize: '1.5rem' }}
                      htmlColor={mainIconColor}
                    />
                  )}
            </IconButton>
            <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="previous song"
                onClick={() => props.setSkipSong({ skip:false, clicked: true, date: new Date() })}>
                <FastRewindRounded 
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                />
            </IconButton>

            <IconButton
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label={props.paused.paused ? true : false}
                onClick={() => props.setPaused({
                  paused: !props.paused.paused,
                  clicked: true
                })}>
                {props.paused.paused ? (
                <PlayArrowRounded
                  sx={{ fontSize: '3.5rem' }}
                  htmlColor={mainIconColor}
                />
                ) : (
                <PauseRounded sx={{ fontSize: '3.5rem' }} htmlColor={mainIconColor} />
              )}
            </IconButton>

            <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="next song"
                onClick={() => props.setSkipSong({skip: true, clicked: true, date: new Date()})}>
                <FastForwardRounded 
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                />
            </IconButton>


            {props.repeatSong.repeatOff && <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="next song"
                onClick={() => props.setRepeatSong({
                  repeatOff: false,
                  repeatContext: true,
                  repeatTrack: false,
                  clicked: true
                })}>
                <RepeatIcon 
                  sx={{ fontSize: '1.5rem' }}
                  htmlColor={mainIconColor}
                />
            </IconButton>}
            {props.repeatSong.repeatContext && <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="next song"
                onClick={() => props.setRepeatSong({
                  repeatOff: false,
                  repeatContext: false,
                  repeatTrack: true,
                  clicked: true
                })}>
                <RepeatOnIcon 
                  sx={{ fontSize: '1.5rem' }}
                  htmlColor={mainIconColor}
                  />
            </IconButton>}

            {props.repeatSong.repeatTrack && <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="next song"
                onClick={() => props.setRepeatSong({
                  repeatOff: true,
                  repeatContext: false,
                  repeatTrack: false,
                  clicked: true
                })}>
                <RepeatOneIcon 
                  sx={{ fontSize: '1.5rem' }}
                  htmlColor={mainIconColor}
                  />
            </IconButton>}


        </div>
    )
}
