import {ThemeProvider} from '@mui/material/styles'
import {MainPage} from './pages/MainPage'
import {ThemeMode} from './state/ThemeMode'
import {CssBaseline, useMediaQuery} from '@mui/material'
import {useEffect} from "react";
import {darkPalette} from "./theme/darkTheme";
import {lightPalette} from "./theme/lightTheme";
import {getTheme} from "./theme/Theme";
import {LocalStorageKeys} from "./dataaccess/SaveKeys";
import { useGlobalState } from './state/GlobalState'

const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [preferedColorScheme ,setPreferedColorScheme] = useGlobalState(state => [state.preferedColorScheme, state.setPreferedColorScheme])

    useEffect(() => {
        const localPreferedTheme = localStorage.getItem(LocalStorageKeys.PREFERED_COLOR_SCHEME);
        if (localPreferedTheme) {
            setPreferedColorScheme(localPreferedTheme as ThemeMode)
            return
        }

        const preferedTheme = prefersDarkMode ? ThemeMode.DARK_MODE : ThemeMode.LIGHT_MODE;
        setPreferedColorScheme(preferedTheme)
        // eslint-disable-next-line
    }, [prefersDarkMode]) // Need to be only used on prefersDarkMode change

    return (
        <>
            <ThemeProvider theme={getTheme(preferedColorScheme === ThemeMode.DARK_MODE ? darkPalette : lightPalette)}>
                <CssBaseline/>
                <MainPage/>
            </ThemeProvider>
        </>
    )
}

export default App
