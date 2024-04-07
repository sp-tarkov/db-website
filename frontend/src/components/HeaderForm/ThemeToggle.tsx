import { styled, useTheme } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeStore } from "@src/store/theme";

const ThemeToggleContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "primary",
  flexGrow: 1
}));

export const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <ThemeToggleContainer id="themeToggleContainer">
      {theme.palette.mode} mode
      <IconButton
        id="modeToggleButton"
        sx={{ ml: 1 }}
        onClick={toggleTheme}
        color="inherit"
      >
        { theme.palette.mode === "dark" ? (<Brightness7Icon />) : (<Brightness4Icon />) }
      </IconButton>
    </ThemeToggleContainer>
  );
};
