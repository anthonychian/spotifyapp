import React from 'react'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(() => ({
    container: {
        margin: 'auto',
        ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
          width: '90%',
          fontSize: '0.7em',
          paddingTop: 50,
        },
        ['@media (min-width:480px)']: { // eslint-disable-line no-useless-computed-key
            width: 417.59,
            paddingTop: 50,
        },
        ['@media (min-width:1282px)']: { // eslint-disable-line no-useless-computed-key
            width: '33%',
            paddingTop: 0,
        }
      }
  }))

export default function TrackInfo(props) {

    const classes = useStyles()

    return (
        <div className={classes.container}>
            <div style={{"color":"white","fontSize": "2em", "textAlign": "left"}}>
                {props.nowPlaying.name}
            </div>
            <div style={{"paddingBottom":"0.5em","color":"grey","fontSize": "1.5em", "textAlign": "left"}}>
                {props.nowPlaying.artist}
            </div>
        </div>
    )
}
