import React, { useState, useEffect } from 'react'
import ChatMessage from './ChatMessage';

import { collection, query, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ChatRoom(props) {

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
  
    const handleClickOpen = (scrollType) => () => {
      setOpen(true);
      setScroll(scrollType);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);


    const [messages, setMessages] = useState([]);
    // const [formValue, setFormValue] = useState('');
    
    const { name, profile_pic } = props.userInfo

    

    useEffect(() => {
        if (props.currentTrack !== '') {
            getMessages();
            updateMessage();
        }

        async function getMessages() {
            const q = query(collection(props.db, "messages"));
            const querySnapshot = await getDocs(q);
            let messages = []
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            });
            setMessages(messages)
        }
        async function updateMessage() {
            try {
                const docRef = doc(props.db, "messages", "SUVsFfpAP2Vz4gi0UyJG");
                updateDoc(docRef, {
                    text: `Now Playing ${props.currentTrack} on Spotify`,
                    time: props.sliderPosition
                })
                .then(docRef => {
                    // console.log(`Now playing is updated`);
                })
                .catch(error => {
                    console.log(error);
                })
        
            }
            catch(err) {
                console.error("Failed to update count", err)
            }
        }
        
    },[props.db, props.currentTrack, props.currentTrackPosition, props.sliderPosition])

    

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
                            <ChatMessage sx={{}} key={idx} message={message} 
                                name={name} photoURL={profile_pic} />
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
