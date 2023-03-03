import { Box, Link, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback } from 'react';
import { useGlobalState } from '../state/GlobalState';
import { HeaderForm } from './HeaderForm';

const useStyles = makeStyles((theme: Theme) => ({
  headerContainer: {
    display: 'flex',
    flex: '0 1 3vh',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.paper,
    alignItems: 'center',
    padding: '0 10vw 0 10vw',
  },
  linksContainer: {
    display: 'flex',
    flexGrow: 2,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  link: {
    display: 'flex',
    padding: '0 1vw 0 1vw',
    height: '100%',
    alignItems: 'center',
    borderBottom: `1px solid transparent`,
    '&:hover': {
      borderBottom: `1px solid ${theme.palette.action.hover}`,
    },
  },
}))

export const Header = () => {
  const classes = useStyles()
  const websiteLink = useGlobalState(useCallback((state) => state.sptarkovWebsiteUrl,[]))
  const workshopLink = useGlobalState(useCallback((state) => state.sptarkovWorkshopUrl,[]))
  const documentationLink = useGlobalState(useCallback((state) => state.sptarkovDocumentationUrl,[]))

  return (
    <>
      <Box className={classes.headerContainer}>
        <Box className={classes.linksContainer}>
          <Link
            underline="hover"
            color="inherit"
            id="website-link"
            href={websiteLink}
            className={classes.link}
          >
            Website
          </Link>
          <Link
            underline="hover"
            color="inherit"
            id="workshop-link"
            href={workshopLink}
            className={classes.link}
          >
            Workshop
          </Link>
          <Link
            underline="hover"
            color="inherit"
            id="documentation-link"
            href={documentationLink}
            className={classes.link}
          >
            Documentation
          </Link>
        </Box>
        <Box className={classes.formContainer}>
          <HeaderForm/>
        </Box>
      </Box>
    </>
  )
}
