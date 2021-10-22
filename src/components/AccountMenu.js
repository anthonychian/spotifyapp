import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(() => ({
    container: {
        // zIndex: 0,
        // ['@media (max-width:1282px)']: { // eslint-disable-line no-useless-computed-key
        //   display: 'none',
        // }
      }
  }))

export default function AccountMenu(props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.container}>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ backgroundColor: '#191414', borderRadius: '2em' }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 0}}>
            <Avatar alt={props.name} src={props.src} sx={{ width: 32, height: 32 }}></Avatar>
            <Typography sx={{ fontWeight: "bold", fontSize:"0.9em", color: "white", minWidth: 100, pr: 0}}>{props.name}</Typography>
          </IconButton>
        </Tooltip>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            color: 'white',
            bgcolor: '#191414',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
        <Avatar alt={props.name} src={props.src} sx={{ width: 32, height: 32 }}/> Profile
        </MenuItem>
        <MenuItem
          onClick={(e) => {
              props.setParticlesOn(!props.particlesOn)
          }}>
          {props.particlesOn && <div>
            <BlurOffIcon />
            <span style={{marginLeft: "1em"}}>
              Particles off
            </span>
          </div>}
          {!props.particlesOn && <div>
            <BlurOnIcon />
            <span style={{marginLeft: "1em"}}>
              Particles on
            </span>
          </div>}
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Settings sx={{ color: "white" }} fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <a href={'https://accounts.spotify.com/en/logout'}>
        <MenuItem>
          <ListItemIcon>
            <Logout sx={{ color: "white" }} fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        </a>
      </Menu>
    </div>
  );
}
