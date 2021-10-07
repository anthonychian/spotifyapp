import React from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';

export default function MyPlaylists(props) {
    return (
        <ImageList sx={{ width: '50%', height: 'auto', paddingBottom: '5em' }} cols={3}>
            {props.playlists.map((playlist) => (
                <ImageListItem onClick={props.clickPlaylist} key={playlist.id}>
                    <a href={playlist.uri}>
                    <img
                        src={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format`}
                        height="200"
                        width="200"
                        srcSet={`${playlist.images[0].url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={playlist.name}
                        loading="lazy"
                        longdesc={playlist.id}
                    />
                    </a>
                    <ImageListItemBar
                        title={playlist.name}         
                        subtitle={playlist.owner.display_name}
                        actionIcon={
                        <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-label={`info about ${playlist.name}`}
                        >
                        </IconButton>
                        }
                    />
                </ImageListItem>
            ))}
        </ImageList>
    )
}
