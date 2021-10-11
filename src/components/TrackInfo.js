import React from 'react'

export default function TrackInfo(props) {
    return (
        <div style={{"width": "30%", "margin": "auto"}}>
            <div style={{"color":"white","fontSize": "2em", "textAlign": "left"}}>
                {props.nowPlaying.name}
            </div>
            <div style={{"paddingBottom":"0.5em","color":"grey","fontSize": "1.5em", "textAlign": "left"}}>
                {props.nowPlaying.artist}
            </div>
        </div>
    )
}
