import * as React from 'react';
import { Typography, Box,  Toolbar, AppBar, Fade, Collapse } from '@mui/material';
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import { useUser } from '@auth0/nextjs-auth0/client';
import { AccountCircle, Scale } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';
import HomeButton from './HomeButton';
import Image from "next/image"
import {Fab} from "@mui/material"
import { Spin as Hamburger } from 'hamburger-react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header = () => {
    const home = process.env.AUTH0_BASE_URL
    const HEADER_IMAGE_PATH = "/LN24_w.svg"
    const HEADER_IMAGE_SCALE = 2
    const HEADER_IMAGE_SIZE = 24 * HEADER_IMAGE_SCALE
    const { user, isLoading, error } = useUser()
    const [menuOpen, setMenuOpen ] = React.useState(false)
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };
    const router = useRouter()

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true)
    };
    const handleClose = () => {
        setAnchorEl(null);
        setMenuOpen(false)
    };

    return (
        <React.Fragment>
            <AppBar position="sticky" color="primary">
                
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={()=>{router.push("/")}}
                    >   
                            <Image alt="header_button" width={HEADER_IMAGE_SIZE} height={HEADER_IMAGE_SIZE} src={HEADER_IMAGE_PATH}/>
                    </IconButton>

                        <Typography variant="h6"  onClick={()=>{router.push("/")}} component="div" sx={{ flexGrow: 1 }}>
                           <Link style={{ textDecoration: 'none',color:"white" }} href="/">Tvättbokning NH&GH</Link>
                        </Typography>

                     {user?.name=="admin" && <Fab variant="extended" color="secondary" aria-label="add"  onClick={()=>{router.push("/admin")}}>
                    <AdminPanelSettingsIcon />
                        <Typography sx={{display : {xs : "none", sm:"block"}}}>Admin</Typography>
                    </Fab>}
                    {auth && (
                        <><IconButton
                            sx={{ borderRadius: 10 }}
                            aria-label="account of current user"
                            disableRipple
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit">
                                    <Hamburger toggled={menuOpen} size={24}/>                           
                        </IconButton><Box>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    
                                    <HomeButton/>
                                    <ProfileButton />
                                    <LoginButton />
                                </Menu>
                            </Box></>
                    )}

                </Toolbar>
            </AppBar>
            {/* Recommended hack when using postiion="sticky" from MUI docs */}
            <Toolbar/>
            </React.Fragment>
    )

};

export default Header;