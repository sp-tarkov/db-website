import {Box} from '@mui/material'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(() => ({
    footerHolder: {
        display: 'flex',
        flex: '0 1 3vh',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10vw 0 10vw'
    }
}))

export const Footer = () => {
    const classes = useStyles()

    return (
        <Box className={classes.footerHolder}>
        </Box>
    )
}
