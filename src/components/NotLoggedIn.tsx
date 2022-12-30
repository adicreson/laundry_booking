import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";


const NotLoggedIn: NextPage = () => {

    return (
        <Grid container display="grid" alignItems="center" sx={{
            justifyContent: "center",
            my: "200px"
        }}><Container maxWidth="lg">
                <Box>
                    <Typography>Du är utloggad</Typography>
                </Box>
                <Box>
                    <Button href="/">Tillbaka till start</Button>
                </Box>
                <Box>
                    <Button href="/api/auth/login">Logga in</Button>
                </Box>
            </Container>
        </Grid>
    )
}
export default NotLoggedIn