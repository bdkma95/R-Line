import React from 'react'
import Router from 'next/router'

import {List, ListItem, ListItemText, ListItemIcon, IconButton, Typography, Divider, Box, Toolbar} from '@material-ui/core'
import MuiDrawer from '@material-ui/core/Drawer'
import MuiAppBar from '@material-ui/core/AppBar';

import CssBaseline from '@material-ui/core/CssBaseline'

import { styled, createTheme, ThemeProvider } from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import BallotIcon from '@material-ui/icons/Ballot'



const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
);


const mdTheme = createTheme();

export default function Menu() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
      setOpen(!open);
    }; 

    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                    pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                    }}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    >
                    Airnext Token Administration
                    </Typography>
                    
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    <ListItem button onClick= { () => Router.push('/home')} >
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                
                    <ListItem button onClick= { () => Router.push('/ownerContract')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Owner Contract" />
                    </ListItem>
                
                    <ListItem button onClick= { () => Router.push('/transaction')}>
                        <ListItemIcon>
                            <BallotIcon />
                        </ListItemIcon>
                        <ListItemText primary="Transaction" />
                    </ListItem>
                </List>
            </Drawer>    
        </Box>
      </ThemeProvider>
    );
}