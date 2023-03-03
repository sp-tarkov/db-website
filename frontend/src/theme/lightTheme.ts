import {ThemeMode} from '../state/ThemeMode';
import {blue, common, grey} from "@mui/material/colors";
import createPalette from "@mui/material/styles/createPalette";

export const lightPalette = createPalette({
    mode: ThemeMode.LIGHT_MODE,
    background: {
        default: grey[100],
        paper: grey[300]
    },
    text: {
        primary: common.black,
        secondary: blue[500],
        disabled: grey[600]
    },
    action: {
        hover: blue[500],
    }
});