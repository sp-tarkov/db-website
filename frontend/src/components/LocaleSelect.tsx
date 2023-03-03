import { Select, MenuItem, Theme, Box, FormControl } from '@mui/material'
import {makeStyles} from '@mui/styles'
import { useCallback, useEffect } from 'react';
import { useGlobalState } from '../state/GlobalState'

const useStyles = makeStyles((theme: Theme) => ({
  localeHolder: {
    display: 'flex',
    flexGrow: 1,
    padding: '0 0.5vw 0 0.5vw'
  },
  select: {
    display: 'flex',
    flexGrow: 1
  }
}))



export const LocaleSelect = () => {
  const classes = useStyles()
  const [preferedLocale, setPreferedLocale] = useGlobalState(useCallback(state => [state.preferedLocale, state.setPreferedLocale],[]))
  const [localesList, refreshLocalesList] = useGlobalState(useCallback(state => [state.localesList, state.refreshLocalesList],[]))

  useEffect(()=> refreshLocalesList(), [refreshLocalesList])

  return (
    <>
    <Box className={classes.localeHolder}>
        <FormControl fullWidth variant="standard">
          <Select
            displayEmpty
            className={classes.select}
            labelId="prefered-locale"
            value={localesList.length > 0 ? preferedLocale : ''}
            onChange={(evt) => {
              setPreferedLocale(evt.target.value)
            }}
            id="locale-selector"
          >
            <MenuItem disabled value="">
              <em>Language</em>
            </MenuItem>
            {localesList.map((locale, idx) => (
              <MenuItem key={idx} value={locale}>
                {locale}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}
