import React from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

const Widget = styled('div')(() => ({
    padding: 16,
    borderRadius: 16,
    width: 343,
    maxWidth: '100%',
    margin: 'auto',
    position: 'relative',
    zIndex: 7,
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
    let position = props.currentPosition.position / 1000;
    if (isNaN(props.currentPosition.total) || isNaN(props.currentPosition.position)) {
        duration = 0;
        position = 0;
    }

    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = Math.floor(value - minute * 60);
        return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Widget>
                <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={position}
                    min={0}
                    step={1}
                    max={duration}
                    onChange={(_, value) => props.setCurrentPosition({
                        position: value * 1000,
                        total: props.currentPosition.total,
                        onChange: true
                    })}
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
                    <TinyText>{formatDuration(position)}</TinyText>
                    <TinyText>-{formatDuration(duration - position)}</TinyText>
                </Box>
            </Widget>
        </Box>
    );
    
}
