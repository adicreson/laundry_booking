import { Box, Container, Typography, Paper} from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import NotLoggedIn from "../src/components/NotLoggedIn";
import NotAuthorized from "../src/components/NotAuthorized";
import Header from "../src/components/Header";
import UserGrid from "../src/components/admin/UserGrid";

import {Grid} from "@mui/material";

const Admin = () => {
    const { user, isLoading, error } = useUser()
    

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} flexGrow={1}>
                <Header/>
            </Grid>
            {user && !isLoading ?
            <Grid item xs={12}>
                <Box>
                    {user.name == "admin" ?  
                            <UserGrid/>
                        :<NotAuthorized/>
                    }</Box></Grid>:<NotLoggedIn />
                
            }
        </Grid>
    )
}

export default Admin