import createPalette from "@mui/material/styles/createPalette";
import { common, grey, lightBlue, yellow } from "@mui/material/colors";

export const darkPalette = createPalette({
  mode: "dark",
  background: {
    default: grey[900],
    paper: "#121212"
  },
  text: {
    primary: common.white,
    secondary: "#8894a2",
    disabled: lightBlue[100]
  },
  action: {
    hover: yellow[700]
  }
});
