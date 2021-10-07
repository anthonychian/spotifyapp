import React, { useState, useEffect, useRef } from "react";

import MyBubbles from './MyBubbles'
import AccountMenu from './AccountMenu'
import MyPlaylists from './MyPlaylists'
import MyTracks from './MyTracks'
import NowPlaying from './NowPlaying'
import PlayerButtons from './PlayerButtons'
import MyCircularColor from './MyCircularColor'

import useAuth from "../useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles'
import Marquee from "react-fast-marquee";


const useStyles = makeStyles(theme => ({
    alignItemsAndJustifyContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
        zIndex: "1",
        backgroundColor: '#191414',
        background: 'linear-gradient(rgba(0,0,0,0.8),transparent)',
    },
    avatar: {
        padding: "1em 0 0 1em"
    },
    bubbles: {
        zIndex: "2",
        height: "100vh",
        width: "100vw",
        position: "absolute"
    }
  }))
  

// Setting the spotifyApi, so that we can use it's functions
const spotifyApi = new SpotifyWebApi({
  clientId: "7b215911d14245089d73d78055353cb2",
});


const Dashboard = ({ code }) => {

    const classes = useStyles()

    const backgroundColor = useRef(0);

    const accessToken = useAuth(code);
    
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        followers: 0,
        profile_pic: '',
        link: '',
        id: '',
    })
    const [playlists, setPlaylists] = useState([])
    const [tracks, setTracks] = useState([])
    const [currentTrack, setCurrentTrack] = useState('')
    const [currentPlaylist, setCurrentPlaylist] = useState('')
    const [currentPlaylistName, setCurrentPlaylistName] = useState('')
    const [nowPlaying, setNowPlaying] = useState({})
    const [currentColor, setCurrentColor] = useState('')
    const [paused, setPaused] = useState('')
    const [skipSong, setSkipSong] = useState('')
    const [loading, setLoading] = useState(true);

    // delay to display loading for 1 second
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setLoading(false);
            },  1000);
            return () => clearTimeout(timeoutID);
    });


    // keeps track of current song (runs every 1 second)
    useEffect(() => {
        const timeoutID = setTimeout(() => {

            spotifyApi.getMyCurrentPlaybackState()
            .then(function(data) {
                // Output items
                if (data.body && data.body.is_playing) {
                    
                    if (paused === null || paused !== false) {
                        setPaused(false);
                    }

                    axios({
                        url: `https://api.spotify.com/v1/me/player/currently-playing`,
                        method: 'GET',
                        headers: {
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                        }
                    }).then(function(res) {
                        let allArtists = ' '
                        if (res.data?.item?.artists) {
                            res.data?.item?.artists.map((x) => (
                                allArtists += ` ${x.name}, `
                            ))
                        }
                        setNowPlaying({
                            name: res.data.item.name,
                            artist: allArtists,
                            image: res.data.item.album.images[0].url,
                        })
                    }).catch(function(error) {
                        console.log(error)
                    });

                } else {

                    if (paused === null || paused !== true) {
                        setPaused(true);
                    }
                }
            }, function(err) {
                console.log('Something went wrong!', err);
            });

        }, 1000);
        return () => clearTimeout(timeoutID);
    });

    // when paused changes (play button is clicked)
    useEffect(() => {
        function changePlayState() {
            if (paused) {
                // Pause a User's Playback
                spotifyApi.pause()
                .then(function() {
                    console.log('Playback paused');
                }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                    console.log('Something went wrong!', err);
                });
            }
            else {
                // Start/Resume a User's Playback 
                spotifyApi.play()
                .then(function() {
                    console.log('Playback started');
                }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                    console.log('Something went wrong!', err);
                });
            }
        }
        changePlayState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused]);

    // when skipSong changes (song is clicked)
    useEffect(() => {
        function nextOrPrevious() {
            if (skipSong.skip) {
                // Skip User’s Playback To Next Track
                spotifyApi.skipToNext()
                .then(function() {
                    console.log('Skip to next');
                }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
                });
            }
            else {
                // Skip User’s Playback To Previous Track 
                spotifyApi.skipToPrevious()
                .then(function() {
                    console.log('Skip to previous');
                }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
                });
            }
        }
        nextOrPrevious()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipSong]);

    // when currentColor changes (song is clicked)
    useEffect(() => {
        function changeColor() {
            backgroundColor.current.style.backgroundColor = currentColor
        }
        changeColor()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentColor]);

    // use effect runs when currentTrack changes (song is clicked)
    useEffect(() => {
        async function playTrack() {
            if (!accessToken || !currentTrack) return;
            
            // Setting Up the spotifyApi with AccessToken so that we can use its functions anywhere in the component without setting AccessToken value again & again. 
            spotifyApi.setAccessToken(accessToken);
            
            await axios({
                url: `https://api.spotify.com/v1/me/player/queue?uri=${currentTrack}`,
                method: 'POST',
                headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
                }
            }).then(function(response) {
                // console.log("#1 added to queue");
            }).catch(function(error) {
                console.log(error)
            });

            spotifyApi.skipToNext()
            .then(function() {
            // console.log('#2 Skip to next');
            }, function(error) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log(error);
            });
        }

        playTrack();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack]);

    // use effect runs when accessToken or currentPlaylist changes (playlist is clicked)
    useEffect(() => {
        if (!accessToken) return;

        // Setting Up the spotifyApi with AccessToken so that we can use its functions anywhere in the component without setting AccessToken value again & again. 
        spotifyApi.setAccessToken(accessToken);

        // Get user details with help of getMe() function
        spotifyApi.getMe().then(data => {

        // update the state of user info
        setUserInfo({
            name: data.body.display_name,
            email: data.body.email,
            followers: data.body.followers.total,
            profile_pic: data.body.images[0].url,
            link: data.body.uri,
            id: data.body.id
            })

            // Get playlist details by user id
            spotifyApi.getUserPlaylists(data.body.id)
                .then(userPlaylists => {
                    
                    if (userPlaylists.body.items.length > 0) {
                        // update the state of playlists once
                        setPlaylists(userPlaylists.body.items)
                        
                        if (!currentPlaylist) {
                            setCurrentPlaylist(userPlaylists.body.items[0].id)
                            setCurrentPlaylistName(userPlaylists.body.items[0].name)
                        }
                        else {
                            spotifyApi.getPlaylist(currentPlaylist)
                            .then(userPlaylist => {
                                // for each track in each playlist
                                userPlaylist.body.tracks.items.forEach((song) => {
                                    // console.log(song.track)
                                    // update tracks state with name and image for each track
                                    let allArtists = ''
                                    song.track.artists.map((x) => (
                                        allArtists += `${x.name}, `
                                    ))
                                    setTracks(tracks => [
                                        ...tracks, {
                                            name: song.track.name,
                                            artist: allArtists,
                                            image: song.track.album.images[0].url,
                                            link: song.track.uri
                                        } 
                                    ]);
                                })
                            });
                        }
                    }
                    
                });
        })
        
    }, [accessToken, currentPlaylist]);

    function clickSong(event, song) {
        // console.log(e.target.getAttribute('longdesc'))
        setCurrentTrack(event.target.getAttribute('longdesc'))
        setNowPlaying({
            name: song.name, artist: song.artist, image: song.image
        })
    }
    function clickPlaylist(e) {
        // console.log(e.target.getAttribute('longdesc'))
        setCurrentPlaylistName(e.target.getAttribute('alt'))
        setCurrentPlaylist(e.target.getAttribute('longdesc'))
        setTracks([])
    }

  return (
    
    <div ref={backgroundColor} className={classes.body}>
        {/* <MyBubbles/> */}
        <div className={classes.bubbles}>
            <MyBubbles/>
        </div>
        <div style={{"height":"100vh"}}>
            <div className={classes.avatar}>
                <AccountMenu name={userInfo.name} src={userInfo.profile_pic} />
            </div>
            {nowPlaying.image && <div style={{
                display: loading ? "none" : "block"}}>
                <div style={{"width": "30%", "margin": "auto"}}>
                    <Marquee gradient={false} pauseOnHover={true} speed={40}>
                        <div style={{"color":"white","fontSize": "2em"}} 
                        className={classes.alignItemsAndJustifyContent}>
                            {nowPlaying.name}
                        </div>
                    </Marquee>
                    <Marquee gradient={false} pauseOnHover={true} speed={40}>
                        <div style={{"paddingBottom":"0.5em","color":"grey","fontSize": "1.5em"}} 
                        className={classes.alignItemsAndJustifyContent}>
                            {nowPlaying.artist}
                        </div>
                    </Marquee>
                </div>

                <div style={{"paddingBottom":"1em"}}>
                    <NowPlaying setCurrentColor={setCurrentColor} nowPlaying={nowPlaying}/>
                    <div className={classes.alignItemsAndJustifyContent}>
                        <PlayerButtons paused={paused} setPaused={setPaused} setSkipSong={setSkipSong}/>
                    </div>
                </div>
            </div>}
            {nowPlaying && <div 
                style={{
                display: loading ? "flex" : "none",
                alignItems: 'center',
                justifyContent: 'center',
                height: "100%", 
                width: "100%"
            }}>
                <MyCircularColor/>
            </div>}

        </div>
        <div className={classes.alignItemsAndJustifyContent}>
            <MyPlaylists playlists={playlists} clickPlaylist={clickPlaylist}/>
        </div>
        <div style={{"width": "30%", "margin": "auto"}}className={classes.alignItemsAndJustifyContent}>
            <Marquee gradient={false} pauseOnHover={true} speed={40}>
                <div style={{"color":"white","fontSize": "1.5em"}}>
                    {currentPlaylistName}
                </div>
            </Marquee>
        </div>
        <div className={classes.alignItemsAndJustifyContent}>
            <MyTracks tracks={tracks} clickSong={clickSong}/>
        </div>
    </div>
  );
};

export default Dashboard;