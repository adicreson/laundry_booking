import { Box, Card, CardMedia, Grid, ImageListItem, Link, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";

export const AboutText = () => {

    const fontWeight = 'medium'

    return (
        <Box sx={{
            padding: {
                sx: 6, md: 2
            }
        }}>
            <Grid container>

                <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} xs={12} md={7}>

                    <Typography variant="h3" fontWeight={fontWeight} align="center">
                        About us
                    </Typography>

                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ maxWidth: 230, boxShadow: "none" }} >
                        <CardMedia image={"/about_pic.png"} sx={{ height: 150 }} />
                    </Card>


                </Grid>

                <List>
                    <ListItemText>
                        <Typography fontWeight={fontWeight}>
                            This website was created by Adi Creson, Adam Schlyter Sonesson och Axel Sneitz-Björkman, while living at a corridor by the name of NH2 in Lunds nation, as a means of solving the inadequate laundry booking system at said student accommodation. The project is, for all of the authors, their first venture into the world of web development, and was done as a side project while still being students.

                            Lunds Nation houses around 300 tenants in 275 apartments, all of which use the website regularly to book laundry times. When booking a time, tenants get access to a laundry room, housing 5 washing-machines, as well as space for hanging wet laundry to dry. Access to this room is divided into ten daily time-slots between the hours of 07:00 and 22:00, this means that each time slot has access to the washing machines for a duration of one hour and 30 minutes.


                        </Typography>
                    </ListItemText>

                    <ListItemText sx={{ paddingTop: 2 }}>
                        <Typography fontWeight={fontWeight}>
                            The authors of this project would like to direct gratitude towards everyone who helped realize the website. The authors would like to thank the residents of NH2 during the spring of 2023, who helped test the website and provide valuable feedback. The authors would also like to thank Julia Lindsten, Mirac Ziyanak and Rebecca Nilsson, who acted as intermediaries between us and the accommodation, for all of the support received during the many meetings together.
                        </Typography>
                    </ListItemText>

                    <ListItemText sx={{ paddingTop: 2 }}>
                        <Typography fontWeight={fontWeight}>
                            For the interested, the project is public and can be viewed at our github repository where more information about the project can be found in the README and project specification.

                        </Typography>

                        <Link href="https://github.com/lundsnation/laundry_booking">https://github.com/lundsnation/laundry_booking</Link>
                    </ListItemText>
                </List>
            </Grid >
        </Box >


    )
}