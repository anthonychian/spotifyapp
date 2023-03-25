import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Lyrics(props) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function formatLyrics(lyrics) {
    let res = [];
    lyrics?.forEach((element) => {
        if (element.charAt(0) === '[' ) {
            res.push('\n')
            res.push(element);
        }
        else res.push(element)
    });
    return res;
  }

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
        <Button  sx={{fontSize:'0.7em', color: 'white'}}onClick={handleClickOpen('body')}>Lyrics</Button>
      {/* <Button onClick={handleClickOpen('paper')}>Body</Button> */}
      <Dialog
        transitionDuration={300}
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{props.name}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            component={'span'}
          >
            <div>
            {(props.lyrics === '') ? 
            <p>
                N/A
            </p> :
            formatLyrics(props.lyrics?.split('\n')).map(
                (text, index) => 
                    (text === '\n' && index !== 0) ?
                    <div key={index}>
                        <br/>
                    </div> :
                    <div key={index}>
                        {text}
                    </div>
                )
              }
              </div>
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
