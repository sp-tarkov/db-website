import {ThemeMode} from '../state/ThemeMode';
import {common, grey, lightBlue, yellow} from '@mui/material/colors';
import createPalette from "@mui/material/styles/createPalette";

export const darkPalette = createPalette({
    mode: ThemeMode.DARK_MODE,
    background: {
        default: grey[900],
        paper: '#121212'
    },
    text: {
        primary: common.white,
        secondary: '#8894a2',
        disabled: lightBlue[100]
    },
    action: {
        hover: yellow[700]
    },
});