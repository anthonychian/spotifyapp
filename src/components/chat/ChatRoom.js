import React, { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage';
import { db } from '../../firebase';
import {
    onSnapshot, collection, query, getDocs, doc, updateDoc, arrayUnion,
    arrayRemove, addDoc, serverTimestamp, orderBy, limit
} from "firebase/firestore";
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
    sliderPosition, currentTrack, currentTrackURI }) {

    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [playFromDB, setPlayFromDB] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [groupSessionNames, setGroupSessionNames] = useState([]);
    const { name, profile_pic } = userInfo;

    const handleModalOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleDrawerOpen = () => {
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
        // play from db must be false
        // console.log('trying to update message')

        try {
            if (choice === 'add') {
                const docRef = doc(db, "people", "lY4KY2dHXpTFEqsq3qFD");
                updateDoc(docRef, {
                    people: arrayUnion(name)
                })
                    .then(docRef => {
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
                    .then(docRef => {
                        console.log('updated group session')
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


    const [formValue, setFormValue] = useState('');
    const sendChatMessage = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "chat"), {
                text: formValue,
                name: name,
                photoURL: profile_pic,
                createdAt: serverTimestamp()
            })
                .then(docRef => {
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
                    // onClick={handleDrawerClose}
                    onClose={handleDrawerClose}
                    PaperProps={{ sx: { height: 440, backgroundColor: 'transparent' } }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {groupSessionNames && groupSessionNames.map((people, idx) => (
                            <Tooltip key={idx} title={people}>
                                <IconButton>
                                    <Avatar alt={susAmogus} src={randomizeIcons(idx)} sx={{ width: 64, height: 64 }} />
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Box>
                    <div style={{ height: '10px' }} />
                    <Box sx={{ height: '10%', width: '100%', position: 'relative' }}>
                        <form onSubmit={sendChatMessage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                            <button type='submit'>submit</button>
                        </form>
                        <div style={{ height: '20px' }} />
                        {chatMessages && chatMessages.map((message, idx) => (
                            <ChatMessage sx={{}}
                                key={idx} message={message} name={name} photoURL={profile_pic} />
                        ))}
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
                <DialogTitle id="scroll-dialog-title"></DialogTitle>
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
        </div>
    )
}
