import React from 'react'
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';

const mainIconColor = 'white'
export default function PlayerButtons(props) {
    return (
        <div>
            <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="previous song"
                onClick={() => props.setSkipSong({skip:false, date: new Date()})}>
                <FastRewindRounded 
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                  />
            </IconButton>

            <IconButton
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label={props.paused ? true : false}
                onClick={() => props.setPaused(!props.paused)}
            >{props.paused ? (
                <PlayArrowRounded
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                />
              ) : (
                <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
              )}
            </IconButton>

            <IconButton 
                sx={{ fontSize: 80, paddingTop : "0.5em", color: "white" }}
                aria-label="next song"
                onClick={() => props.setSkipSong({skip: true, date: new Date()})}>
                <FastForwardRounded 
                  sx={{ fontSize: '3rem' }}
                  htmlColor={mainIconColor}
                  />
            </IconButton>
        </div>
    )
}
