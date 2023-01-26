import { Button, Paper, AlertColor, Grid, IconButton, Typography, Box, SnackbarOrigin, Fade, Tooltip } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from "react";
import { Booking, timeFromTimeSlot } from "../../../utils/types"
import BookingInfo from "./BookingInfo"
import { UserType } from "../../../utils/types";
import { dateFromTimeSlot } from "../../../utils/bookingsAPI";
import ConfirmBooking from "../ConfirmBooking";

interface Props {
    boothIndex: number,
    user: UserType;
    booking: Booking | null;
    selectedDate: Date;
    timeSlot: string;
    updateBookings: () => void;
    snackTrigger: (severity: AlertColor, snackString: string, alignment: SnackbarOrigin) => void;
}
const BookingButton = (props: Props) => {
    const { boothIndex, user, booking, selectedDate, timeSlot, updateBookings, snackTrigger } = props
    const [disabled, setDisabled] = useState<boolean>(false)
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [showBookingInfo, setShowBookingInfo] = useState<boolean>(false)
    const bookedTimeSlot = booking != null;
    const myTimeSlot = user.name == booking?.userName ? bookedTimeSlot : null;
    const timeSlotDate = dateFromTimeSlot(selectedDate, timeSlot)
    const timeSlotHasPassed = new Date().getTime() > timeSlotDate.getTime()
    console.log("BookingButton being run")

    useEffect(() => {
        setDisabled(timeSlotHasPassed)
    }, [timeSlotHasPassed]);

    const handleOpenConfirmation = (open: boolean) => {
        setOpenConfirmation(open);
    }

    let title = ""
    if (myTimeSlot && !timeSlotHasPassed) {
        title = "Tryck för att avboka tiden"
    } else if (bookedTimeSlot && !myTimeSlot) {
        title = "Tiden är bokad av annan hyresgäst."
    } else if (!bookedTimeSlot && !timeSlotHasPassed) {
        title = "Tryck för att boka tiden"
    } else {
        title = "Tiden har passerat"
    }

    return (
        <Grid container>
            <ConfirmBooking
                open={openConfirmation}
                myTimeSlot={myTimeSlot}
                timeSlot={timeSlot}
                booking={booking}
                date={selectedDate}
                user={user}
                handleOpenConfirmation={handleOpenConfirmation}
                snackTrigger={snackTrigger}
            />

            <Grid item xs={2} md={1}></Grid>

            <Grid item xs={8} md={10}>
                <Tooltip
                    title={title}
                    placement={"right"}
                >
                    {/*The span is a hack to enable tooltip on disabled buttons*/}
                    {/*The sx height is also a hack to make the buttongroup same size as calendar vertically*/}
                    <span>
                        <Button
                            fullWidth
                            size="small"
                            sx={{ height: 334 / 10 }}
                            variant="contained"
                            onClick={() => handleOpenConfirmation(true)}
                            color={!bookedTimeSlot ? 'primary' : 'secondary'}
                            disabled={(bookedTimeSlot && !myTimeSlot) || disabled}
                        >

                            <Grid container >
                                <Grid item xs={7} >
                                    <Typography variant="button" align="left">{timeSlot}</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="button" align="left" sx={{ textTransform: "none" }}>Bås {" " + boothIndex}</Typography>
                                </Grid>

                            </Grid>
                        </Button>
                    </span>
                </Tooltip>
            </Grid>

            <Grid item xs={2} md={1}>
                <IconButton disabled={!(bookedTimeSlot && !myTimeSlot)}
                    onClick={() => { setShowBookingInfo(true) }}
                    style={{ padding: 0, height: 20, width: 20, marginBottom: "-8px" }}>
                    {(bookedTimeSlot && !myTimeSlot) ?
                        <InfoOutlinedIcon color="action" />
                        : null}
                </IconButton>
                {booking && <BookingInfo
                    showBookingInfo={showBookingInfo}
                    booking={booking}
                    setShowBookingInfo={setShowBookingInfo}
                />}
            </Grid >

        </Grid>
    );
};

export default BookingButton;
