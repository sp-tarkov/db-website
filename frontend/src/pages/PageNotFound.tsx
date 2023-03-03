import {Box, Theme, Typography} from '@mui/material'
import {NavigationBreadcrumb} from './mainPageComponents/NavigationBreadcrumb'
import {makeStyles} from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        padding: '2vh 2vw 1vh 2vw'
    },
    notFoundAreaHolder: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        background: theme.palette.background.paper,
        padding: '2vh 2vw 2vh 2vw',
    },
    notFoundContainer: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        width: "100%",
        alignItems: "center",
        paddingTop: "10vh"
    },
}))

export const PageNotFound = () => {
    const classes = useStyles();
    return (
        <>
            <NavigationBreadcrumb/>
            <Box className={classes.searchContainer}>
                <Box className={classes.notFoundAreaHolder}>
                    <Box className={classes.notFoundContainer}>
                        <Typography id={'not-found-message'} variant={"h3"}>This page does not exist !</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
