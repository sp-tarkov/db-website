import { DarkModeToggle } from './DarkModeToggle'
import { LocaleSelect } from './LocaleSelect'
import { JsonTheme } from './JsonTheme'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end',
    height: '100%'
  },
}));

export const HeaderForm = () => {
  const classes = useStyles();

  return (
    <>
      <form className={classes.form}>
          <DarkModeToggle />
          <LocaleSelect />
          <JsonTheme />
      </form>
    </>
  )
}
