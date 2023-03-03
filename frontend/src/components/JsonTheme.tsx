import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ReactJsonViewThemes } from '../state/ReactJsonViewThemes'
import { LocalStorageKeys } from '../dataaccess/SaveKeys'
import { useGlobalState } from '../state/GlobalState'
import { useCallback } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  jsonHolder: {
    display: 'flex',
    flexGrow: 1,
    padding: '0 0.5vw 0 0.5vw'
  },
  select: {
    display: 'flex',
    flexGrow: 1
  }
}))

export const JsonTheme = () => {
  const classes = useStyles()
  const [preferedJsonViewerTheme, setPreferedJsonViewerTheme] = useGlobalState(
    useCallback(
      (state) => [
        state.preferedJsonViewerTheme,
        state.setPreferedJsonViewerTheme,
      ],
      [],
    ),
  )
  return (
    <>
      <Box className={classes.jsonHolder}>
        <FormControl fullWidth variant="standard">
          <Select
            displayEmpty
            className={classes.select}
            labelId="react-json-view-theme"
            value={preferedJsonViewerTheme}
            label="JSON theme"
            onChange={(evt) => {
              setPreferedJsonViewerTheme(evt.target.value)
              localStorage.setItem(
                LocalStorageKeys.PREFERED_JSON_THEME,
                evt.target.value,
              )
            }}
            id="json-selector"
          >
            <MenuItem disabled value="">
              <em>JSON theme</em>
            </MenuItem>
            {ReactJsonViewThemes.map((theme, idx) => (
              <MenuItem key={idx} value={theme}>
                {theme}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}
