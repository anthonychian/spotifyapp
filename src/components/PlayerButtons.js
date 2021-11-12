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
        <div style={{"zIndex": "0"}}>
            <IconButton 
                sx={{ fontSize: 80, color: "white" }}
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
                sx={{ fontSize: 80, color: "white" }}
                aria-label="previous song"
                onClick={() => props.setSkipSong({ skip:false, clicked: true, date: new Date() })}>
                <FastRewindRounded 
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                />
            </IconButton>

            <IconButton
                sx={{ fontSize: 80, color: "white" }}
                aria-label={props.paused.paused ? true : false}
                onClick={() => 
                  props.setPaused({
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
                sx={{ fontSize: 80, color: "white" }}
                aria-label="next song"
                onClick={() => props.setSkipSong({skip: true, clicked: true, date: new Date()})}>
                <FastForwardRounded 
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                />
            </IconButton>


            {props.repeatSong.repeatMode === 0 && <IconButton 
                sx={{ fontSize: 80, color: "white" }}
                aria-label="next song"
                onClick={() => props.setRepeatSong({
                  repeatMode: 1,
                  clicked: true
                })}>
                <RepeatIcon 
                  sx={{ fontSize: '1.5rem' }}
                  htmlColor={mainIconColor}
                />
            </IconButton>}
            {props.repeatSong.repeatMode === 1 && <IconButton 
                sx={{ fontSize: 80, color: "white" }}
                aria-label="next song"
                onClick={() => props.setRepeatSong({
                  repeatMode: 2,
                  clicked: true
                })}>
                <RepeatOnIcon 
                  sx={{ fontSize: '1.5rem' }}
                  htmlColor={mainIconColor}
                  />
            </IconButton>}

            {props.repeatSong.repeatMode === 2 && <IconButton 
                sx={{ fontSize: 80, color: "white" }}
                aria-label="next song"
                onClick={() => props.setRepeatSong({
                  repeatMode: 0,
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
