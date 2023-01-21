//Imoprt
import { Button, Drawer, List, ListItem, Popper, SwipeableDrawer, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useState } from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RulesText from "./RulesText";


interface Props {

}

const Rules = (props: Props) => {
    const [drawerOpen, setdrawerOpen] = useState<boolean>(false);


    const toggleDrawer = () => {
        setdrawerOpen(!drawerOpen);
    }


    const ruleText = (
        <Typography variant={'button'} sx={{ textOrientation: 'upright', writingMode: 'vertical-lr' }}>
            Regler
        </Typography>
    )

    return (

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {!drawerOpen && <Tooltip
                placement={'right'}
                title={<> <KeyboardDoubleArrowRightIcon /></>}
            >
                <Button
                    variant={'outlined'}
                    onClick={toggleDrawer}
                    color="primary"
                    sx={{
                        display: { md: "inline-flex" },
                        zIndex: 'tooltip',
                        padding: 1,
                        minWidth: 40,
                        left: 0,
                        top: '20%',
                        position: 'fixed'
                    }}
                >

                    {ruleText}
                </Button>
            </Tooltip>}
            <SwipeableDrawer
                PaperProps={{
                    sx: {
                        width: 600
                    }
                }}
                open={drawerOpen}
                onClose={toggleDrawer}
                onOpen={toggleDrawer}
            >
                <RulesText />
            </SwipeableDrawer>
        </Box >
    )
}

export default Rules;