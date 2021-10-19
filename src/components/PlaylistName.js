import React from 'react'

export default function PlaylistName(props) {
    return (
        <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
            <div style={{"color":"white","fontSize": "1.5em"}}>
                {props.currentPlaylistName}
            </div>
        </div>
    )
}
