import React, { useState, useEffect } from 'react'
import ChatMessage from './ChatMessage';
import { db } from '../../firebase';
import {
    onSnapshot, collection, query, getDocs, doc, updateDoc, arrayUnion,
    arrayRemove, addDoc, serverTimestamp, orderBy, limit
} from "firebase/firestore";

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GroupsIcon from '@mui/icons-material/Groups';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

import Marquee from "react-fast-marquee";

import redAmogus from '../../assets/red amogus.gif';
import blueAmogus from '../../assets/blue amogus.gif';
import greenAmogus from '../../assets/green amogus.gif';
import orangeAmogus from '../../assets/orange amogus.gif';
import yellowAmogus from '../../assets/yellow amogus.gif';
import cyanAmogus from '../../assets/cyan amogus.gif';
import limeAmogus from '../../assets/lime amogus.gif';
import purpleAmogus from '../../assets/purple amogus.gif';
import pinkAmogus from '../../assets/pink amogus.gif';
import brownAmogus from '../../assets/brown amogus.gif';
import blackAmogus from '../../assets/black amogus.gif';
import susAmogus from '../../assets/red amogus2.gif';

export default function ChatRoom({ userInfo, playDBTrack,
    sliderPosition, currentTrack, currentArtist, currentTrackURI }) {

    const [playFromDB, setPlayFromDB] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [groupSessionNames, setGroupSessionNames] = useState([]);
    const { name, profile_pic } = userInfo;

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        updateGroupSession('add');
        getGroupSession();
    }, []);


    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "messages", "SUVsFfpAP2Vz4gi0UyJG"), (doc) => {
            setPlayFromDB(true)
            playDBTrack(doc.data().URI)
        });
        //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
        return () => unsubscribe()

    }, []);
    useEffect(() => {
        const q = query(collection(db, "chat"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            getChatMessages()
        });
        //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
        return () => unsubscribe()

    }, []);
    useEffect(() => {
        const q = query(collection(db, "people"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            getGroupSession()
        });
        //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
        return () => {
            updateGroupSession('remove')
            unsubscribe()
        }

    }, []);


    useEffect(() => {
        getChatMessages();
    }, [])
    async function getChatMessages() {
        const q = query(collection(db, "chat"), orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        let messages = []
        querySnapshot.forEach((doc) => {
            messages.push(doc.data())
        });
        setChatMessages(messages)
    }
    async function getGroupSession() {
        const q = query(collection(db, "people"));
        const querySnapshot = await getDocs(q);
        let names = []
        querySnapshot.forEach((doc) => {
            names.push(doc.data())
        });
        setGroupSessionNames(names[0].people)
    }
    async function updateGroupSession(choice) {
        try {
            if (choice === 'add') {
                const docRef = doc(db, "people", "lY4KY2dHXpTFEqsq3qFD");
                updateDoc(docRef, {
                    people: arrayUnion(name)
                })
                    .then(() => {
                        // console.log('updated group session')
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            else {
                const docRef = doc(db, "people", "lY4KY2dHXpTFEqsq3qFD");
                updateDoc(docRef, {
                    people: arrayRemove(name)
                })
                    .then(() => {
                        // console.log('updated group session')
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
        catch (err) {
            console.error("Failed to update", err)
        }
    }

    useEffect(() => {

        getMessages();
        updateMessage();

        async function getMessages() {
            const q = query(collection(db, "messages"));
            const querySnapshot = await getDocs(q);
            let messages = []
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            });
            setMessages(messages)
        }
        async function updateMessage() {
            if (!playFromDB) {
                try {
                    const docRef = doc(db, "messages", "SUVsFfpAP2Vz4gi0UyJG");
                    updateDoc(docRef, {
                        name: name,
                        photoURL: profile_pic,
                        text: currentTrack,
                        artist: currentArtist,
                        time: sliderPosition,
                        URI: currentTrackURI,
                    })
                        .then(() => {
                            // console.log('update message')
                            setPlayFromDB(false)
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                catch (err) {
                    console.error("Failed to update count", err)
                }
            }
            setPlayFromDB(false)
        }

    }, [currentTrackURI])


    const [formValue, setFormValue] = useState('');
    const sendChatMessage = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "chat"), {
                text: formValue,
                name: name,
                photoURL: profile_pic,
                createdAt: serverTimestamp()
            })
            .then(() => {
                setFormValue("");
                getChatMessages();
            })
        } catch (err) {
            console.error("writeToDB failed. reason :", err)
        }
    }

    function randomizeIcons(num) {
        // const number = Math.floor(Math.random() * 12);
        let icon;
        switch (num) {
            case 0:
                icon = redAmogus;
                break;
            case 1:
                icon = blueAmogus;
                break;
            case 2:
                icon = cyanAmogus;
                break;
            case 3:
                icon = limeAmogus;
                break;
            case 4:
                icon = yellowAmogus;
                break;
            case 5:
                icon = orangeAmogus;
                break;
            case 6:
                icon = purpleAmogus;
                break;
            case 7:
                icon = pinkAmogus;
                break;
            case 8:
                icon = greenAmogus;
                break;
            case 9:
                icon = blackAmogus;
                break;
            case 10:
                icon = brownAmogus;
                break;
            case 11:
                icon = susAmogus;
                break;
            default:
                icon = susAmogus;
                break;
        }
        return icon;
    }
    // # 1 
    // initial false
    // play song -> update message -> set to false
    // set to true, play from db
    // false from update overwrites true from earlier

    // # 2
    // initial false
    // listen from db -> set to true, play db track
    // cannot update message
    // set to false

    return (

        <div style={{
            display: 'flex', justifyContent: 'center',
            alignContent: 'center', backgroundColor: 'black'
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100px', height: '100px', position: 'fixed', right: '1%', top: '0%'
            }}>
                <Tooltip
                    title={'Chat'} 
                    placement="left"
                    arrow>
                    <IconButton>
                        <GroupsIcon
                            sx={{ color: 'blue' }}
                            onClick={handleDrawerOpen}>Open</GroupsIcon>
                    </IconButton>
                </Tooltip>
                
            </div>
            <Drawer
                anchor='right'
                variant="persistent"
                open={drawerOpen}
                onClose={handleDrawerClose}
                PaperProps={{ 
                    sx: {
                        backgroundColor: 'black',
                        "@media (max-width:480px)": {
                            width: '100%',
                        },
                        "@media (min-width:480px)": {
                            width: "100%",
                        },
                        "@media (min-width:1282px)": {
                            width: '33%',
                        },
                        
                    } 
                }}>
                <IconButton sx={{ width: '50px', margin: '0.5em 0 0 0.5em' }} onClick={handleDrawerClose}>
                    <ChevronRightIcon sx={{ color: 'white' }}/>
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {groupSessionNames && groupSessionNames.map((people, idx) => (
                        <Tooltip key={idx} title={people}>
                            <IconButton>
                                <Avatar alt={susAmogus} src={randomizeIcons(idx)} sx={{ width: 64, height: 64 }} />
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>
                <Box sx={{ height: '500px', width: '100%',
                    // backgroundColor: 'black',
                    // border: 1,
                    // borderColor: 'white',
                    // borderRadius: '16px',
                    marginTop: '50px',
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    overflowY: "scroll"}}>
                    {chatMessages && chatMessages.map((message, idx) => (
                        <ChatMessage key={idx} message={message} name={name} photoURL={profile_pic} />
                    ))}
                </Box>
                <Box sx={{ marginTop: '10px', height: '50px', width: '100%'}}>
                    <form onSubmit={sendChatMessage} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Input
                            value={formValue}
                            placeholder='Type a message...'
                            onChange={(e) => setFormValue(e.target.value)}
                            sx={{ padding: '0.5em', backgroundColor: 'white', width: '70%', borderRadius: '16px' }}
                            endAdornment={
                                <InputAdornment>
                                    <IconButton onClick={sendChatMessage}>
                                        <SendIcon sx={{ color: 'black' }} />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </form>
                </Box>
                <Box sx={{ marginTop: '3em', height: '50px', width: '100%'}}>
                    {messages && messages.map((message) => (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt={'photo'} src={message.photoURL} sx={{ width: 30, height: 30 }} />
                            <Typography sx={{ textAlign: 'center', marginLeft: '0.5em',  fontWeight: "bold", fontSize: "1em", color: "white" }}>
                                {message.name} is playing:
                            </Typography>
                        </div >
                    ))}
                </Box>
                <Box sx={{ height: '50px', width: '100%' }}>
                    <Marquee gradient={false} speed={40}>
                        {messages && messages.map((message, idx) => (
                            <Typography key={idx} sx={{ textAlign: 'center', fontWeight: "bold", fontSize: "1.5em", color: "white" }}>
                               {message.artist} - {message.text}
                            </Typography>
                        ))}
                    </Marquee>
                </Box>
            </Drawer>
        </div>
    )
}
