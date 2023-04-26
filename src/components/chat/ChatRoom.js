import React, { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage';

import { onSnapshot, collection, query, getDocs, doc, updateDoc } from "firebase/firestore";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ChatRoom({db, userInfo, playDBTrack,
    sliderPosition, currentTrack, currentTrackURI}) {

    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    // const [dbName, setdbName] = useState('');
  
    const handleClickOpen = (scrollType) => () => {
      setOpen(true);
      setScroll(scrollType);
    };
  
    const handleClose = () => {
      setOpen(false);
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
            playDBTrack(doc.data().URI)
        });
        //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
        return () => unsubscribe()
    }, []);

    useEffect(() => {
        if (currentTrack !== '') {
            getMessages();
            updateMessage();
        }

        async function getMessages() {
            const q = query(collection(db, "messages"));
            const querySnapshot = await getDocs(q);
            let messages = []
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            });
            setMessages(messages)
            // setdbName(messages[0].name)
        }
        async function updateMessage() {
            // console.log('dbName: ' + dbName)
            // console.log('name: ' + name)
            try {
                const docRef = doc(db, "messages", "SUVsFfpAP2Vz4gi0UyJG");
                updateDoc(docRef, {
                    name,
                    photoURL: profile_pic,
                    text: currentTrack,
                    time: sliderPosition,
                    URI: currentTrackURI,
                })
                .then(docRef => {

                })
                .catch(error => {
                    console.log(error);
                })        
            }
            catch(err) {
                console.error("Failed to update count", err)
            }
        }
        
    },[currentTrackURI])

    
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
        
        <div style={{ display: 'flex', justifyContent: 'center', 
            alignContent: 'center', backgroundColor: 'black'}}>
            <div style={{padding: '1em'}}>
                <Button  sx={{fontSize:'1.5em', color: 'white'}}
                    onClick={handleClickOpen('body')}>
                    Music Queue
                </Button>
            </div>
            <Dialog
                transitionDuration={300}
                open={open}
                onClose={handleClose}
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
                <Button onClick={handleClose}>Close</Button>
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
