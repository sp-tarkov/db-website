import {createTheme, Palette} from '@mui/material/styles';

export const getTheme = (palette: Palette) => createTheme({
    palette: palette,
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        textDecoration: 'none'
                    }
                }
            }
        },
        MuiInput:{
            styleOverrides: {
                root: {
                    '&:before': {
                        borderColor: 'transparent',
                    },
                    '&:after': {
                        borderColor: 'transparent',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderColor: palette.action.hover,
                    }
                },
                input:{
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: palette.action.hover,
                    },
                    '& .MuiFilledInput-underline:after': {
                        borderBottomColor: palette.action.hover,
                    }
                }
            }
        },
        MuiInputBase:{
            styleOverrides:{
                root:{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline':{
                        borderColor: `${palette.action.hover} !important`,
                    }
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root:{
                    '&.Mui-focused .MuiInputLabel': {
                        color: palette.action.hover
                    }
                }
            }
        }
    }
});