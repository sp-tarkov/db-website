import {Box} from '@mui/material'
import {NavigationBreadcrumb} from './mainPageComponents/NavigationBreadcrumb'
import {SearchArea} from './mainPageComponents/SearchArea'
import {makeStyles} from "@mui/styles";
import React from "react";

const useStyles = makeStyles(() => ({
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        padding: '2vh 2vw 1vh 2vw'
    }
}))

export const InteractiveArea = () => {
    const classes = useStyles();
    return (
        <>
            <NavigationBreadcrumb/>
            <Box className={classes.searchContainer}>
                <SearchArea/>
            </Box>
        </>
    )
}
