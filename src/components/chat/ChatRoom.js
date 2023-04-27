import React, { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage';
import { db } from '../../firebase';
import { onSnapshot, collection, query, getDocs, doc, updateDoc } from "firebase/firestore";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GroupsIcon from '@mui/icons-material/Groups';
import redAmogus from '../../assets/red amogus.gif'

export default function ChatRoom({ userInfo, playDBTrack,
    sliderPosition, currentTrack, currentTrackURI }) {

    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [playFromDB, setPlayFromDB] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleModalOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleDrawerOpen = () => {
        console.log('open')
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);


    const [messages, setMessages] = useState([]);
    const { name, profile_pic } = userInfo


    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "messages", "SUVsFfpAP2Vz4gi0UyJG"), (doc) => {
            // console.log('set to true')
            // console.log('playing from db')
            setPlayFromDB(true)
            playDBTrack(doc.data().URI)
            // set play from db = true
        });
        //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
        return () => unsubscribe()
    }, []);

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
            // play from db must be false
            // console.log('trying to update message')
            if (!playFromDB) {
                try {
                    const docRef = doc(db, "messages", "SUVsFfpAP2Vz4gi0UyJG");
                    updateDoc(docRef, {
                        name: name,
                        photoURL: profile_pic,
                        text: currentTrack,
                        time: sliderPosition,
                        URI: currentTrackURI,
                    })
                        .then(docRef => {
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


    // const [formValue, setFormValue] = useState('');
    // const sendMessage = async(e) => {
    //     e.preventDefault();
    //     try {
    //         const docRef = await addDoc(collection(props.db, "messages"), {
    //             text: formValue,
    //             name: name,
    //             photoURL: profile_pic,
    //             createdAt: serverTimestamp()
    //           });
    //       } catch(err) {
    //         console.error("writeToDB failed. reason :", err)
    //       }
    // }
    // const docRef = addDoc(collection(props.db, "messages"), {
    //     text: `Now Playing ${props.currentTrack} on Spotify`,
    //     name: name,
    //     photoURL: profile_pic,
    //     createdAt: serverTimestamp()
    // });

    return (

        <div style={{
            display: 'flex', justifyContent: 'center',
            alignContent: 'center', backgroundColor: 'black'
        }}>
            <div style={{ padding: '1em' }}>
                <Button sx={{ fontSize: '1.5em', color: 'white' }}
                    onClick={handleModalOpen('body')}>
                    Music Queue
                </Button>

                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100px', height: '100px', position: 'fixed', right: '1%', top: '0%'
                }}>
                    <IconButton>
                        <GroupsIcon
                            sx={{ color: 'blue' }}
                            onClick={handleDrawerOpen}>Open</GroupsIcon>
                    </IconButton>
                </div>
                <Drawer
                    anchor='bottom'
                    open={drawerOpen}
                    onClick={handleDrawerClose}
                    onClose={handleDrawerClose}
                    PaperProps={{ sx: { height: 240, backgroundColor: 'transparent' } }}
                >
                    <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tooltip title={name}>
                            <IconButton>
                                <Avatar alt={redAmogus} src={redAmogus} sx={{ width: 64, height: 64 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Drawer>
            </div>
            <Dialog
                transitionDuration={300}
                open={open}
                onClose={handleModalClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Chat </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        component={'span'}
                    >
                        <div>
                            {messages && messages.map((message, idx) => (
                                <ChatMessage sx={{}} key={idx} message={message} />
                            ))}
                        </div>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* <div>
                {messages && messages.map((message, idx) => (
                    <ChatMessage sx={{}}
                        key={idx} message={message} name={name} photoURL={profile_pic} />
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <button type='submit'>submit</button>
            </form> */}

        </div>
    )
}
