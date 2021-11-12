import { React, useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

const Widget = styled('div')(() => ({
    padding: 16,
    borderRadius: 16,
    width: 343,
    maxWidth: '100%',
    ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
        width: 250,
    },
    minWidth: 250,
    margin: 'auto',
    position: 'relative',
    zIndex: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(40px)',
    opacity: '70%',
  }));
  
  const TinyText = styled(Typography)({
    color: 'white',
    fontSize: '0.75rem',
    opacity: 0.78,
    fontWeight: 500,
    letterSpacing: 0.2,
  });

export default function MySlider(props) {

    const theme = useTheme();
    let duration = props.currentPosition.total / 1000;
    // let position = props.currentPosition.position / 1000;

    // const [sliderPosition, setSliderPosition] = useState(0);
    const [sliderPause, setSliderPause] = useState(false)

  
    
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if(!props.paused.paused && !sliderPause) {
                props.setSliderPosition(props.sliderPosition + 1)
            }
        }, 1000);
        return () => clearTimeout(timeoutID);
    });

    useEffect(() => {
        // console.log('setting to 0')
        props.setSliderPosition(props.currentPosition.position / 1000)
        //props.setSliderPosition(0)
    }, [props.currentTrack]);


    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = Math.floor(value - minute * 60);
        return `${minute}:${secondLeft <= 9 ? `0${secondLeft}` : `${secondLeft}`}`;
    }
    function handleEvent(event) {
        if (event.type === "mousedown" || event.type === "touchstart") {
            setSliderPause(true)
        } else {
            setSliderPause(false)
        }
    }
    

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Widget>
                <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={props.sliderPosition}
                    min={0}
                    step={1}
                    onMouseDown={handleEvent}
                    onMouseUp={handleEvent}
                    onTouchStart={handleEvent}
                    onTouchEnd={handleEvent}
                    max={duration}
                    onChange={(_, value) => {
                        // Only update the UI. Do nothing to the audio. This is similar to youtube music.
                        props.setSliderPosition(value)
                    }}
                    onChangeCommitted={(_, value) => {
                        props.setCurrentPosition({
                            position: value * 1000,
                            total: props.currentPosition.total,
                            onChange: true
                        })
                    }}
                    // 1. Update audio file's position
                    //   1.2 in the completion handler of updating audo file, 
                    //       also update UI because it may lag before audio file starts playing.
                    sx={{
                    color: 'white',
                    height: 4,
                    '& .MuiSlider-thumb': {
                        width: 8,
                        height: 8,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:before': {
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px ${
                            theme.palette.mode === 'dark'
                            ? 'rgb(255 255 255 / 16%)'
                            : 'rgb(0 0 0 / 16%)'
                        }`,
                        },
                        '&.Mui-active': {
                        width: 20,
                        height: 20,
                        },
                    },
                    '& .MuiSlider-rail': {
                        color: 'white',
                        opacity: 0.30,
                    },
                    }}
                />
                <Box
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: -2,
                }}>
                    <TinyText>{formatDuration(props.sliderPosition)}</TinyText>
                    <TinyText>-{formatDuration(duration - props.sliderPosition)}</TinyText>
                </Box>
            </Widget>
        </Box>
    );
    
}
