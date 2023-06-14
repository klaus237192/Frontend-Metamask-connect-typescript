import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, InputLabel } from '@mui/material';
import ConnectIcon from '@mui/icons-material/ConnectWithoutContact'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
export default function ButtonAppBar(props: { handleConnect: React.MouseEventHandler<HTMLButtonElement> | undefined; isConnecting: any; }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            METAMASK PROJECT
          </Typography>
          <Button color="inherit" onClick={props.handleConnect} size="large" startIcon={<ConnectIcon />} >{props.isConnecting ? "DISCONNECT" : "CONNECT TO METAMASK"}<img src="metamask.svg" width={100} height={50} /></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}