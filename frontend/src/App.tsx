import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import { useThemeStore } from "@src/store/theme";
import { getTheme } from "@src/theme/Theme";
import { darkPalette } from "@src/theme/darkTheme";
import { lightPalette } from "@src/theme/lightTheme";
import { Router } from "@src/router/router";
import { Header } from "@src/components/Header";
import { Footer } from "@src/components/Footer";

const AppContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  height: "100vh",
  maxheight: "100vh"
}));

export const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [checkedPreferredColorScheme, setCheckedPreferredColorScheme] = useThemeStore((store) => [store.checkedPreferredColorScheme, store.setCheckedPreferredColorScheme]);
  const [themeMode, setThemeMode] = useThemeStore((store) => [store.themeMode, store.setThemeMode]);

  useEffect(() => {
    if(checkedPreferredColorScheme) {
      return;
    }

    const preferredTheme: "dark" | "light" = prefersDarkMode ? "dark" : "light";
    if(preferredTheme !== themeMode) {
      setThemeMode(preferredTheme);
    }

    setCheckedPreferredColorScheme();
    // eslint-disable-next-line
  }, []); // Need to be only used on prefersDarkMode change

  return (
    <ThemeProvider theme={getTheme(themeMode === "dark" ? darkPalette : lightPalette)}>
      <CssBaseline />
      <AppContainer>
        <Header />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};
