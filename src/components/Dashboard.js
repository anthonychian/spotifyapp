import React, { useState, useEffect, useRef } from "react";

import MyBubbles from "./MyBubbles";
import AccountMenu from "./AccountMenu";
import MyPlaylists from "./MyPlaylists";
import MyTracks from "./MyTracks";
import NowPlaying from "./NowPlaying";
import PlayerButtons from "./PlayerButtons";
import MySlider from "./MySlider";
import TrackInfo from "./TrackInfo";
import PlaylistName from "./PlaylistName";

import useAuth from "../useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Marquee from "react-fast-marquee";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


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
    background: "linear-gradient(rgba(0,0,0,0.8),transparent)",
  },
  bottomBar: {
    height: '10%',
    backgroundColor: '#191414!important',
    ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
      height: '15%',
    }
  },
  avatar: {
    padding: "1em 0 0 1em",
    ['@media (max-width:1282px)']: { // eslint-disable-line no-useless-computed-key
      display: 'none',
    }
  },
  avatar2: {
    display: "none",
    ['@media (max-width:480px)']: { // eslint-disable-line no-useless-computed-key
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

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      {children}
    </Slide>
  );
}

const Dashboard = ({ props, code }) => {
  const classes = useStyles();

  const backgroundColor = useRef(null);

  // console.log(code)
  const accessToken = useAuth(code);
  //console.log(accessToken)
  spotifyApi.setAccessToken(accessToken);

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
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [paused, setPaused] = useState({});
  const [skipSong, setSkipSong] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDevice, setActiveDevice] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({});
  const [spinner, setSpinner] = useState(0);
  const [particlesOn, setParticlesOn] = useState(true);
  const [shuffle, setShuffle] = useState({});
  const [repeatSong, setRepeatSong] = useState({
    repeatOff: true,
    repeatContext: null,
    repeatTrack: null,
    clicked: false,
  });

  // delay to display loading for a few seconds
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setLoading(false);
    }, 8000);
    return () => clearTimeout(timeoutID);
  }, []);

  // keeps track of current song (runs every 1 second)
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      // Setting Up the spotifyApi with AccessToken so that we can use its functions anywhere in the component without setting AccessToken value again & again.
      // spotifyApi.setAccessToken(accessToken);

      if (!activeDevice) {
        // Get a User's Available Devices
        spotifyApi.getMyDevices().then(
          function (data) {
            let availableDevices = data.body.devices;
            if (availableDevices.length > 0) {
              setActiveDevice(true);
            }
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
      }
      if (activeDevice) {
        spotifyApi.getMyCurrentPlaybackState().then(
          function (data) {
            // console.log(data.body)
            // Output items
            if (data.body) {
              if (data.body.is_playing) {
                // set pause/play button to correctly display current state
                if (paused.paused == null || paused.paused === true)
                  setPaused({
                    paused: false,
                    clicked: false,
                  });
              } else {
                if (paused.paused == null || paused.paused === false)
                  setPaused({
                    paused: true,
                    clicked: false,
                  });
              }

              if (data.body.shuffle_state === false) {
                if (shuffle == null || shuffle === true) {
                  setShuffle({
                    shuffle: false,
                    clicked: false,
                  });
                }
              } else {
                if (shuffle == null || shuffle === false) {
                  setShuffle({
                    shuffle: true,
                    clicked: false,
                  });
                }
              }

              if (data.body.repeat_state === "off") {
                if (
                  repeatSong.repeatOff == null ||
                  repeatSong.repeatOff !== true
                ) {
                  setRepeatSong({
                    repeatOff: true,
                    repeatContext: false,
                    repeatTrack: false,
                    clicked: false,
                  });
                }
              } else if (data.body.repeat_state === "context") {
                if (
                  repeatSong.repeatContext == null ||
                  repeatSong.repeatContext !== true
                ) {
                  setRepeatSong({
                    repeatOff: false,
                    repeatContext: true,
                    repeatTrack: false,
                    clicked: false,
                  });
                }
              } else if (data.body.repeat_state === "track") {
                if (
                  repeatSong.repeatTrack == null ||
                  repeatSong.repeatTrack !== true
                ) {
                  setRepeatSong({
                    repeatOff: false,
                    repeatContext: false,
                    repeatTrack: true,
                    clicked: false,
                  });
                }
              }
            }

            axios({
              url: `https://api.spotify.com/v1/me/player/currently-playing`,
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            })
              .then(function (res) {
                let allArtists = " ";
                if (res.data?.item?.artists) {
                  res.data?.item?.artists.map(
                    (x) => (allArtists += ` ${x.name}, `)
                  );
                  allArtists = allArtists.slice(0, allArtists.length - 2);
                }

                setCurrentPosition({
                  position: res.data.progress_ms,
                  total: res.data.item.duration_ms,
                  onChange: false,
                });


                if (nowPlaying.name !== res.data.item.name) {

                  setNowPlaying({
                    name: res.data.item.name,
                    artist: allArtists,
                    image: res.data.item.album.images[1].url,
                    imageHigh: res.data.item.album.images[0].url,
                    imageLow: res.data.item.album.images[2].url,
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutID);
  });

  // when currentPosition is changed (song position each second or user scrolls position)
  useEffect(() => {
    function changePosition() {
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
      if (repeatSong.repeatOff) {
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
      } else if (repeatSong.repeatContext) {
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
      } else if (repeatSong.repeatTrack) {
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
        spotifyApi.play().then(
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
            //console.log('Skip to next');
          },
          function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log("Something went wrong!", err);
          }
        );
      } else {
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
    if (skipSong.clicked) nextOrPrevious();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSong]);

  // use effect runs when currentTrack changes (song is clicked)
  useEffect(() => {
    async function playTrack() {
      if (!accessToken || !currentTrack) return;

      // Setting Up the spotifyApi with AccessToken so that we can use its functions anywhere in the component without setting AccessToken value again & again.
      // spotifyApi.setAccessToken(accessToken);

      await axios({
        url: `https://api.spotify.com/v1/me/player/queue?uri=${currentTrack}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(function (response) {
          // console.log("#1 added to queue");
        })
        .catch(function (error) {
          console.log(error);
        });

      spotifyApi.skipToNext().then(
        function () {
          // console.log('#2 Skip to next');
        },
        function (error) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log(error);
        }
      );
    }

    playTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // use effect runs when accessToken or currentPlaylist changes (playlist is clicked)
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
              setCurrentPlaylistName(userPlaylists.body.items[0].name);
            } else {
              spotifyApi.getPlaylist(currentPlaylist).then((userPlaylist) => {
                // for each track in each playlist
                userPlaylist.body.tracks.items.forEach((song) => {
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
                      image: song.track.album.images[1].url,
                      imageHigh: song.track.album.images[0].url,
                      imageLow: song.track.album.images[2].url,
                      link: song.track.uri,
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
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
    if (!activeDevice) {
      // Get a User's Available Devices
      spotifyApi.getMyDevices().then(
        function (data) {
          let availableDevices = data.body.devices;
          if (availableDevices.length > 0) {
            setActiveDevice(true);
          }
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    }
    if (nowPlaying.name !== event.target.getAttribute("alt")) {
      setCurrentTrack(event.target.getAttribute("longdesc"));
      setNowPlaying({
        name: song.name,
        artist: song.artist,
        image: song.image,
        imageHigh: song.imageHigh,
        imageLow: song.imageLow,
      });
    }
  }
  function clickPlaylist(e) {
    if (e.target.getAttribute("alt") !== null && (e.target.getAttribute("alt") !== currentPlaylistName)) {
      window.scrollTo({
        top: document.body.scrollHeight || document.documentElement.scrollHeight,
        left: document.body.scrollHeight || document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      setCurrentPlaylistName(e.target.getAttribute("alt"));
      setCurrentPlaylist(e.target.getAttribute("longdesc"));
      setTracks([]);
      setSpinner(spinner + 1);
    }
  }
  function changeColor(color) {
    backgroundColor.current.style.backgroundColor = color;
  }

  return (
    <div>
        <div 
            style={{
                display: !loading && activeDevice && nowPlaying.image ? "block" : "none",
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
                {(document.documentElement.scrollTop !== 0) && <HideOnScroll {...props}>
                  <AppBar className={classes.bottomBar} sx={{ top: 'auto', bottom: 0}}>
                    <Toolbar>
                      <img style={{marginTop: '10px'}}alt= {nowPlaying.name} src={nowPlaying.imageLow}/>
                      <Typography variant="h7" component="div">
                        <div style={{ position: 'relative', display: 'runIn', marginLeft: '1em'}}>
                          <span style={{
                            position: 'absolute', 
                            width: '250px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.9em'}}> 
                              {nowPlaying.name}
                          </span>
                          <br/>
                          <span style={{
                            position: 'absolute', 
                            width: '250px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'grey', 
                            fontSize: '0.8em'}}> 
                              {nowPlaying.artist} 
                          </span>
                        </div>
                      </Typography>
                      <div style={{position: 'relative', width: '100%',textAlign: 'right'}}>
                        <span style={{cursor: 'pointer'}} onClick={clickScrollUp}>
                        </span>
                      </div>
                      <div style={{ height: '100%', width: '3em',cursor: 'pointer', marginLeft: 'auto'}} onClick={clickScrollUp}>
                        <div style={{position: 'absolute', top: '40%'}}>
                          <KeyboardArrowUpIcon />
                        </div>
                      </div>
                    </Toolbar>
                  </AppBar>
                </HideOnScroll>}

                <Marquee
                className={classes.trackInfoContainer}
                gradient={false}
                speed={40}
                >
                    <TrackInfo nowPlaying={nowPlaying} />
                </Marquee>

                <div style={{ paddingBottom: "1em" }}>
                <NowPlaying changeColor={changeColor} nowPlaying={nowPlaying} />

                <div className={classes.alignItemsAndJustifyContent}>
                    <PlayerButtons
                    paused={paused}
                    setPaused={setPaused}
                    setSkipSong={setSkipSong}
                    shuffle={shuffle}
                    setShuffle={setShuffle}
                    repeatSong={repeatSong}
                    setRepeatSong={setRepeatSong}
                    />
                </div>
                <div className={classes.alignItemsAndJustifyContent}>
                    <MySlider
                    setCurrentPosition={setCurrentPosition}
                    currentPosition={currentPosition}
                    />
                </div>
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
                <div className={classes.alignItemsAndJustifyContent}>
                    <MyPlaylists playlists={playlists} clickPlaylist={clickPlaylist} currentPlaylistName={currentPlaylistName}/>
                </div>

                {/* <Marquee style={{"width": "40%", "margin": "auto"}}gradient={false} speed={40}> */}
                <PlaylistName currentPlaylistName={currentPlaylistName} />
                {/* </Marquee> */}

                <div className={classes.alignItemsAndJustifyContent}>
                    <MyTracks
                    tracks={tracks}
                    clickSong={clickSong}
                    spinner={spinner}
                    activeDevice={activeDevice}
                    />
                </div>
            </div>
          }

    </div>
  );
};

export default Dashboard;
