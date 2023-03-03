import { Box, IconButton, Theme } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { ThemeMode } from '../state/ThemeMode'
import { useGlobalState } from '../state/GlobalState'
import { useCallback } from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  modeToggleButtonHolder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'primary',
    flexGrow: 1,
  },
  iconButton: {
    ml: 1,
  },
}))

export const DarkModeToggle = () => {
  const theme = useTheme()
  const classes = useStyles()
  const [preferedColorScheme, setPreferedColorScheme] = useGlobalState(
    useCallback(
      (state) => [state.preferedColorScheme, state.setPreferedColorScheme],
      [],
    ),
  )

  const toggleColor = () => {
    const newTheme =
      preferedColorScheme === ThemeMode.LIGHT_MODE
        ? ThemeMode.DARK_MODE
        : ThemeMode.LIGHT_MODE
    setPreferedColorScheme(newTheme)
  }

  return (
    <Box className={classes.modeToggleButtonHolder} id="modeToggleButtonHolder">
      {theme.palette.mode} mode
      <IconButton
        className={classes.iconButton}
        sx={{ ml: 1 }}
        onClick={toggleColor}
        color="inherit"
        id="modeToggleButton"
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  )
}
