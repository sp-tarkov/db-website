import { useState } from 'react'
import { Box, Breadcrumbs, Link, Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useGlobalState } from '../../state/GlobalState'
import { ItemWithLocale } from '../../dto/ItemWithLocale'

const useStyles = makeStyles((theme: Theme) => ({
  breadcrumbHolder: {
    display: 'flex',
    flex: '0 1 3vh',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 10vw 0 10vw',
    borderBottom: `1px solid ${theme.palette.background.paper}`,
  },
  breadcrumb: {
    display: 'flex',
    flex: '0 1 3vh',
    flexDirection: 'row',
    flexGrow: 1,
  },
  link: {
    color: theme.palette.text.secondary,
    display: 'flex',
    padding: '0 1vw 0 1vw',
    height: '100%',
    alignItems: 'center',
    borderBottom: `1px solid transparent`,
    '&:hover': {
      color: theme.palette.action.hover,
      cursor: 'pointer',
    },
  },
  currentItem: {
    cursor: 'default',
    borderBottom: `1px solid ${theme.palette.action.hover}`,
  },
}))

export const NavigationBreadcrumb = () => {
  const classes = useStyles()
  const setSelectedItem = useGlobalState((state) => state.setSelectedItem)
  const itemHierachyState = useGlobalState((state) => state.itemsHierarchy)
  const [searchInputState, setSearchInput] = useGlobalState((state) => [
    state.searchInput,
    state.setSearchInput,
  ])
  const selectedItem = useGlobalState((state) => state.selectedItem)
  const [currentHierarchy, setCurrentHierarchy] = useState<ItemWithLocale[]>([])

  useEffect(() => {
    if (!selectedItem) return;

    const hierarchy: ItemWithLocale[] = [selectedItem]
    let currItemID: string | undefined = selectedItem?.item?._parent
    while (currItemID) {
      const item: ItemWithLocale = itemHierachyState[currItemID]
      hierarchy.push(item)
      currItemID = item?.item?._parent
    }
    setCurrentHierarchy(hierarchy.filter(elt => elt !== undefined && elt !== null).reverse())
  }, [selectedItem, itemHierachyState])

  const formatLink = (item: ItemWithLocale, idx: string) => {
    if (
      searchInputState === item.locale.Name ||
      searchInputState === item.item._id ||
      searchInputState === item.item._name
    ) {
      return (
        <Typography key={item.item._id} variant="body2" className={classes.currentItem}>
          {item.locale.Name ? item.locale.Name : item.item._name}
        </Typography>
      )
    } else {
      return (
        <Link
          underline="hover"
          color="inherit"
          key={idx}
          onClick={() => {
            setSearchInput(item.item._id)
            setSelectedItem(undefined)
          }}
          className={classes.link}
        >
          <Typography variant="body2">{item.locale.Name ? item.locale.Name : item.item._name}</Typography>
        </Link>
      )
    }
  }

  return (
    <Box className={classes.breadcrumbHolder}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb} id='navigation-breadcrumb'>
        <Link
          underline="hover"
          color="inherit"
          key={'home'}
          href="/"
          id='home-breadcrumb'
          className={classes.link}
        >
          <Typography variant="body2">Home</Typography>
        </Link>
        {currentHierarchy.map((item, idx) => formatLink(item, idx.toString()))}
      </Breadcrumbs>
    </Box>
  )
}
