import createPalette from "@mui/material/styles/createPalette";
import { common, grey, blue } from "@mui/material/colors";

export const lightPalette = createPalette({
  mode: "light",
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
    hover: blue[500]
  }
});
