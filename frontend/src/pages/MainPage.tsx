import {Box} from '@mui/material'
import {Footer} from '../components/Footer'
import {Header} from '../components/Header'
import {makeStyles} from "@mui/styles";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import React from "react";
import {InteractiveArea} from "./InteractiveArea";
import {PageNotFound} from "./PageNotFound";

const useStyles = makeStyles(() => ({
    container: {
        background: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100vh',
        maxheight: '100vh',
    }
}))

export const MainPage = () => {
    const classes = useStyles();
    return (
        <>
            <Box className={classes.container}>
                <Header/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/search" element={<InteractiveArea/>}/>
                        <Route path="/search/:id" element={<InteractiveArea/>}/>
                        <Route path="/404" element={<PageNotFound />}/>
                        <Route path="/" element={<Navigate replace to="/search"/>}/>
                        <Route path="*" element={<Navigate replace to="/404" />} />
                    </Routes>
                </BrowserRouter>
                <Footer/>
            </Box>
        </>
    )
}
