import React, { useState, useEffect, useRef } from "react";

import ChatRoom from "../components/chat/ChatRoom";
import MyBubbles from "../components/background/MyBubbles";
import AccountMenu from "../components/settings/AccountMenu";
import MyPlaylists from "../components/playlists/MyPlaylists";
import MyTracks from "../components/tracks/MyTracks";
import NowPlaying from "../components/song-ui/NowPlaying";
import MyAppBar from "../components/bottom-ui/MyAppBar";
import TrackName from "../components/tracks/TrackName";
import PlaylistName from "../components/playlists/PlaylistName";

import { makeStyles } from "@material-ui/core/styles";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Marquee from "react-fast-marquee";

import { getLyrics } from 'genius-lyrics-api';
import useAuth from "../useAuth";
import SpotifyWebApi from "spotify-web-api-node";

const useStyles = makeStyles((theme) => ({
  alignItemsAndJustifyContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    zIndex: "0",
    backgroundColor: "#191414",
    height: "100vh",
    width: "100vw",
    minHeight: "900px",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.8),transparent)",
  },
  avatar: {
    padding: "1em 0 0 1em",
    ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
      display: 'none',
    }
  },
  avatar2: {
    display: "none",
    ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
    }
  },
  bubbles: {
    zIndex: "0",
    height: "100vh",
    width: "100vw",
    position: "absolute",
  },
  trackInfoContainer: {
    margin: "auto",
    "@media (max-width:480px)": {
         
      width: "90%",
      fontSize: "0.7em",
      paddingTop: 50,
    },
    "@media (min-width:480px)": {
      width: 417.59,
      paddingTop: 50,
    },
    "@media (min-width:1282px)": {
      width: "33%",
      paddingTop: 0,
    },
  },
}));

// Setting the spotifyApi, so that we can use it's functions
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const Dashboard = ({ code, db }) => {

  const classes = useStyles();

  const backgroundColor = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    followers: 0,
    profile_pic: "",
    link: "",
    id: "",
  });
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState("");
  const [currentTrackURI, setCurrentTrackURI] = useState("");
  //const [DBTrackURI, setDBTrackURI] = useState("");
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [currentPlaylistURI, setCurrentPlaylistURI] = useState("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [skipSong, setSkipSong] = useState({});
  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(0);
  const [particlesOn, setParticlesOn] = useState(true);
  const [shuffle, setShuffle] = useState({});
  const [scriptLoading, setScriptLoading] = useState(true);
  const [songClickedCounter, setSongClickedCounter] = useState(0);
  const [songChange, setSongChange] = useState(false)
  const [lyrics, setLyrics] = useState('');
  const [sliderPosition, setSliderPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState({
    position: 0,
    total: 0,
    onChange: false,
  });
  const [paused, setPaused] = useState({
    paused: true,
    clicked: false,
  });
  const [repeatSong, setRepeatSong] = useState({
    repeatMode: 0,
    clicked: false
  });

  const accessToken = useAuth(code);
  spotifyApi.setAccessToken(accessToken);

  useEffect(() => {
    function spotifyPlayback() {
      let testSong = ''
      let testPosition = 0;
      let testRepeat = ''
      let testShuffle = ''
      
      if (scriptLoading) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        setScriptLoading(false);
      }
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Spotify Web Player',
          getOAuthToken: callback => {
            callback(accessToken);
          },
          volume: 0.5
        });
        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });
      
        // Playback status updates
        player.addListener('player_state_changed', state => { 
          if (state) {
          if (testPosition !== state.position) {
            setSliderPosition(state.position / 1000)
            setCurrentPosition({
              position: state.position,
              total: state.duration,
              onChange: false,
            });

            setPaused({
              paused: state.paused,
              clicked: false,
            });
          }
          testPosition = state.position
          
          if (testSong !== state.track_window.current_track.name) {
            // console.log('song changed')
            if (songChange) {
              setSongChange(false)
            }
            setSongChange(true)
          
            let allArtists = " ";
            state.track_window.current_track.artists.map(
              (x) => (allArtists += ` ${x.name}, `)
            );
            
            allArtists = allArtists.slice(0, allArtists.length - 2);
            setCurrentTrack(state.track_window.current_track.name)
            setNowPlaying({
              name: state.track_window.current_track.name,
              artist: allArtists,
              imageHigh: state.track_window.current_track.album.images[2].url,
              image: state.track_window.current_track.album.images[0].url,
              imageLow: state.track_window.current_track.album.images[1].url,
              position: state.position,
            });
            // console.log(state.track_window.current_track.uri)
            setCurrentTrackURI(state.track_window.current_track.uri)
            // console.log(`getting lyrics for ${state.track_window.current_track.name} 
            //   by ${state.track_window.current_track.artists[0].name}`)
            const options = {
              apiKey: process.env.REACT_APP_GENIUS_KEY,
              title: state.track_window.current_track.name,
              artist: state.track_window.current_track.artists[0].name,
              optimizeQuery: true,
            };
            getLyrics(options).then((lyrics) => {
              if (lyrics === null) setLyrics('')
              setLyrics(lyrics)
            });
          }
          testSong = state.track_window.current_track.name;

          if (testRepeat !== state.repeat_mode) {
            setRepeatSong({
              repeatMode: state.repeat_mode,
              clicked: false
            })
          }
          testRepeat = state.repeat_mode

          if (testShuffle !== state.shuffle) {
            setShuffle({
              shuffle: state.shuffle,
              clicked: false
            })
          }
          testShuffle = state.shuffle
        }

        });
      
        // Ready
        player.addListener('ready', ({ device_id }) => {
          // console.log('Ready with Device ID', device_id);
          
          spotifyApi.transferMyPlayback([device_id])
          .then(function() {
            // console.log('Transfering playback to ' + device_id);
          }, function(err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
          });
        });
      
        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });
      
        player.connect().then(success => {
          if (success) {
            // console.log('The Web Playback SDK successfully connected to Spotify!');
          }
          else{
            console.log('The Web Playback SDK did not connect')
          }
        })
        
      };
    }
    if (accessToken === undefined) {
      //console.log('token N/A')
    }
    else {
      spotifyPlayback();
    }
    
    
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // delay to display loading for a few seconds
  useEffect(() => {
  const timeoutID = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeoutID);
  }, []);

  // when currentPosition is changed (user scrolls position)
  useEffect(() => {
    function changePosition() {
      // console.log(`changing position ${currentPosition.position}`)
      // Seek To Position In Currently Playing Track
      spotifyApi.seek(currentPosition.position).then(
        function () {
          //console.log('Seek to ' + currentPosition.position_ms);
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
    }
    if (currentPosition.onChange) changePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  useEffect(() => {
    function changeShuffle() {
      if (shuffle.shuffle) {
        // Toggle Shuffle For User’s Playback
        spotifyApi.setShuffle(true).then(
          function () {
            //console.log('Shuffle is on.');
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      } else {
        // Toggle Shuffle For User’s Playback
        spotifyApi.setShuffle(false).then(
          function () {
            //console.log('Shuffle is off.');
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      }
    }
    if (shuffle.clicked) changeShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle]);

  // when repeat button is clicked
  useEffect(() => {
    function changeRepeat() {
      if (repeatSong.repeatMode === 0) {
        // Toggle Repeat For User’s Playback
        spotifyApi.setRepeat("off").then(
          function () {
            // console.log("Repeat is on off.");
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      } else if (repeatSong.repeatMode === 1) {
        // Toggle Repeat For User’s Playback
        spotifyApi.setRepeat("context").then(
          function () {
            // console.log("Repeat is on context.");
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      } else {
        // Toggle Repeat For User’s Playback
        spotifyApi.setRepeat("track").then(
          function () {
            // console.log("Repeat is on track.");
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      }
    }
    if (repeatSong.clicked) changeRepeat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatSong]);

  // delay to display loading for a few seconds

  // when paused changes (play button is clicked)
  useEffect(() => {
    function changePlayState() {
      if (paused.paused) {
        // Pause a User's Playback
        spotifyApi.pause().then(
          function () {
            //console.log('Playback paused');
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      } else {
        // Start/Resume a User's Playback
        // console.log('inside changePlayState')
        spotifyApi.play()
        .then(
          function () {
            //console.log('Playback started');
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      }
    }
    if (paused.clicked) changePlayState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  // when skipSong changes (song is clicked)
  useEffect(() => {
    function nextOrPrevious() {
      if (skipSong.skip) {
        // Skip User’s Playback To Next Track
        spotifyApi.skipToNext().then(
          function () {
            // console.log('Skip to next');
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      } else {
        if (sliderPosition > 2) {
          spotifyApi.seek(0).then(
            function () {
              setSliderPosition(0)
              //console.log('Seek to ' + currentPosition.position_ms);
            },
            function (err) {
              //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
              console.log("Something went wrong!", err);
            }
          );
        }
        else {
          // Skip User’s Playback To Previous Track
          spotifyApi.skipToPrevious().then(
            function () {
              //console.log('Skip to previous');
            },
            function (err) {
              //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
              console.log("Something went wrong!", err);
            }
          );
        }
      }
    }
    if (skipSong.clicked) nextOrPrevious();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSong]);

  // runs when currentTrack changes (song is clicked)
  useEffect(() => {
    async function playTrack() {
      if (!accessToken || !currentTrack) return;

      // Setting Up the spotifyApi with AccessToken so that we can use its functions anywhere in the component without setting AccessToken value again & again.
      // spotifyApi.setAccessToken(accessToken);

      // Start/Resume a User's Playback
      // console.log('inside playTrack')
      spotifyApi.play({
        "context_uri": currentPlaylistURI,
        "offset": { "position": currentTrackPosition }
        // "uris": [currentTrack],
      }).then(
        function () {
          //console.log('Playback started');
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
    }

    playTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songClickedCounter]);

  // runs when accessToken or currentPlaylist changes (playlist is clicked)
  useEffect(() => {
    if (!accessToken) return;

    // Setting Up the spotifyApi with AccessToken so that we can use its functions anywhere in the component without setting AccessToken value again & again.
    // spotifyApi.setAccessToken(accessToken);

    // Get user details with help of getMe() function
    spotifyApi
      .getMe()
      .then((data) => {
        // update the state of user info
        setUserInfo({
          name: data.body.display_name,
          email: data.body.email,
          followers: data.body.followers.total,
          profile_pic: data.body.images[0].url,
          link: data.body.uri,
          id: data.body.id,
        });

        // Get playlist details by user id
        spotifyApi.getUserPlaylists(data.body.id).then((userPlaylists) => {
          if (userPlaylists.body.items.length > 0) {
            // update the state of playlists once
            setPlaylists(userPlaylists.body.items);

            if (!currentPlaylist) {
              setCurrentPlaylist(userPlaylists.body.items[0].id);
              setCurrentPlaylistURI(userPlaylists.body.items[0].uri)
              setCurrentPlaylistName(userPlaylists.body.items[0].name);
            } else {
              spotifyApi.getPlaylist(currentPlaylist).then((userPlaylist) => {
                // for each track in each playlist
                userPlaylist.body.tracks.items.forEach((song, index) => {
                  // update tracks state with name and image for each track
                  let allArtists = "";
                  if (song?.track?.artists) {
                    song.track.artists.map(
                      (x) => (allArtists += `${x.name}, `)
                    );
                    allArtists = allArtists.slice(0, allArtists.length - 2);
                  }
                  setTracks((tracks) => [
                    ...tracks,
                    {
                      name: song.track.name,
                      artist: allArtists,
                      lyricsArtist: song.track.artists[0].name,
                      imageHigh: song.track.album.images[0].url,
                      image: song.track.album.images[1].url,
                      imageLow: song.track.album.images[2].url,
                      link: song.track.uri,
                      position: index,
                    },
                  ]);
                });
              });
            }
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [accessToken, currentPlaylist]);

  function clickScrollUp() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }

  function clickSong(event, song) {
    if (nowPlaying.name !== event.target.getAttribute("alt")) {
      setSongClickedCounter(songClickedCounter + 1)
      setCurrentTrackPosition(song.position);
      setCurrentTrack(song.name);
      setCurrentTrackURI(song.link);
    }
  }
  function clickPlaylist(e, uri) {
    if (e.target.getAttribute("alt") !== null && (e.target.getAttribute("alt") !== currentPlaylistName)) {
      window.scrollTo({
        top: document.body.scrollHeight || document.documentElement.scrollHeight,
        left: document.body.scrollHeight || document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      setCurrentPlaylistName(e.target.getAttribute("alt"));
      setCurrentPlaylist(e.target.getAttribute("longdesc"));
      setCurrentPlaylistURI(uri);
      setTracks([]);
      setSpinner(spinner + 1);
    }
  }
  function clickPlaylistPlayButton(uri, name) {
    
    // setCurrentPlaylistURI(uri);
    // clickScrollUp()
    // console.log('inside clickPlaylistPlayButton')
    spotifyApi.play({
      "context_uri": uri
    }).then(
      function () {
        //console.log('Playback started');
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  }

  function playDBTrack(uri) {
    // Start/Resume a User's Playback
    // console.log('in playDBTrack')
    if ((uri !== currentTrackURI) && currentTrackURI !== "") {
      spotifyApi.play({
        "uris": [uri],
      }).then(
        function () {
          //console.log('Playback started');
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
    }
    else {
      // console.log('already playing the same song')
    }
  }
  
  function changeColor(color) {
    backgroundColor.current.style.backgroundColor = color;
  }

  return (
    <div>
        <div 
            style={{
                display: !loading && nowPlaying.image ? "block" : "none",
                // display: !loading && activeDevice && nowPlaying.image ? "block" : "none",
            }}
            ref={backgroundColor}
            className={classes.body}>
            {nowPlaying.image && <div>
                <div
                  style={{ height: "100%"}}
                  className={classes.bubbles}
                >
                    <MyBubbles particlesOn={particlesOn}/>
                </div>

                <div className={classes.avatar}>
                    <AccountMenu name={userInfo.name} src={userInfo.profile_pic} 
                      particlesOn={particlesOn} setParticlesOn={setParticlesOn}
                    />
                </div>
                
                <MyAppBar 
                  nowPlaying={nowPlaying} 
                  clickScrollUp={clickScrollUp}
                  paused={paused}
                  setPaused={setPaused}
                  setSkipSong={setSkipSong}
                  shuffle={shuffle}
                  setShuffle={setShuffle}
                  repeatSong={repeatSong}
                  setRepeatSong={setRepeatSong}
                  setCurrentPosition={setCurrentPosition}
                  currentPosition={currentPosition}
                  currentTrack={currentTrack}
                  sliderPosition={sliderPosition}
                  setSliderPosition={setSliderPosition}
                />

                <Marquee
                className={classes.trackInfoContainer}
                gradient={false}
                speed={40}
                >
                  <TrackName nowPlaying={nowPlaying} />
                </Marquee>

                <div style={{ paddingBottom: "1em" }}>
                  <NowPlaying changeColor={changeColor} nowPlaying={nowPlaying} lyrics={lyrics} songChange={songChange}/>
                </div>
            </div>}
            
        </div>

        {nowPlaying &&
            <div
            style={{
                display: loading ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
            }}
            >
            <Stack sx={{ color: "white" }} spacing={2} direction="row">
                <CircularProgress size={"5em"} />
            </Stack>
            </div>
        }

          {nowPlaying && 
            <div
            style={{
                display: loading ? "none" : "block",
            }}
            >   <div className={classes.avatar2}>
                  <div style={{marginTop: '5em'}}></div>
                  <AccountMenu name={userInfo.name} src={userInfo.profile_pic} 
                    particlesOn={particlesOn} setParticlesOn={setParticlesOn}
                  />
                </div>
                {/* setDBTrackURI={setDBTrackURI} */}
                <ChatRoom db={db} userInfo={userInfo} playDBTrack={playDBTrack} 
                  sliderPosition={sliderPosition} currentTrack={currentTrack} currentTrackURI={currentTrackURI} />
                <Marquee style={{"width": "50%", "margin": "auto"}}gradient={false} speed={40}>
                  <div style={{"padding": '2em', "color":"white","fontSize": "3em"}}>
                    My Playlists
                  </div>
                </Marquee>
                <div className={classes.alignItemsAndJustifyContent}>
                    <MyPlaylists playlists={playlists} clickPlaylist={clickPlaylist}
                     currentPlaylistName={currentPlaylistName} clickPlaylistPlayButton={clickPlaylistPlayButton} />
                </div>

                <Marquee style={{"width": "40%", "margin": "auto"}}gradient={false} speed={40}>
                  <PlaylistName currentPlaylistName={currentPlaylistName} />
                </Marquee>

                <div className={classes.alignItemsAndJustifyContent}>
                    <MyTracks
                    tracks={tracks}
                    clickSong={clickSong}
                    spinner={spinner}
                    // activeDevice={activeDevice}
                    />
                </div>
            </div>
          }

    </div>
  );
};

export default Dashboard;
