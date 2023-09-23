import {SyntheticEvent, useCallback, useEffect, useState} from 'react'
import {Autocomplete, Box, CircularProgress, Theme, Typography,} from '@mui/material'
import {makeStyles} from '@mui/styles'
import TextField from '@mui/material/TextField'
import ReactJson from 'react-json-view'
import {getItem, getItemHierarchy, searchItem,} from '../../dataaccess/ItemBackend'
import {ItemOption} from '../../dto/ItemOption'
import {useGlobalState} from '../../state/GlobalState'
import {useNavigate, useParams} from "react-router-dom";

interface IItemOption {
    id?: string
    name?: string
    shortName?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    searchAreaHolder: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        background: theme.palette.background.paper,
        padding: '2vh 2vw 2vh 2vw',
    },
    jsonHolder: {
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
        flexDirection: 'column',
        background: theme.palette.background.paper,
        maxHeight: '80vh',
    },
    autocomplete: {},
}))

export const SearchArea = () => {
    const classes = useStyles()
    const params = useParams();
    const navigate = useNavigate();
    const preferedLocale = useGlobalState((state) => state.preferedLocale)
    const preferedJsonViewerTheme = useGlobalState(
        useCallback((state) => state.preferedJsonViewerTheme, []),
    )
    const [searchInputState, setSearchInput] = useGlobalState((state) => [
        state.searchInput,
        state.setSearchInput,
    ])
    const [setHierarchy, initHierarchy] = useGlobalState((state) => [state.setHierarchy, state.initHierarchy])
    const [selectedItem, setSelectedItem] = useGlobalState((state) => [
        state.selectedItem,
        state.setSelectedItem,
    ])
    const [selectOptions, setSelecteOptions] = useState<ItemOption[]>([])
    const [isbusy, setIsBusy] = useState<boolean>(false)
    const searchThreshold = 3

    const handleNameInput = useCallback(async (input: string) => {
        const searchResults = await searchItem(input, preferedLocale)
        const options = searchResults?.map((res) => ({
            id: res.item._id,
            name: res.locale.Name ? res.locale.Name : res.item._name,
            shortName: JSON.stringify(res.locale.ShortName)
        }))
        setSelecteOptions(options ? options : [])
    }, [preferedLocale])

    const handleIDInput = useCallback(async (input: string) => {
        const itemJson = await getItem(input, preferedLocale)
        if (!itemJson) {
            setSelectedItem(undefined)
            setSearchInput('')
            return;
        }

        setSelectedItem(itemJson)
        const itemObj = {
            id: itemJson.item._id,
            name: itemJson.locale.Name ? itemJson.locale.Name : itemJson.item._name,
            shortName: itemJson.locale.ShortName
        }
        setSelecteOptions([itemObj])
        setSearchInput(itemObj.name)

        // Update hierachy
        const itemHierarchy = await getItemHierarchy(
            itemJson.item,
            preferedLocale,
        )
        setHierarchy(itemHierarchy ? itemHierarchy : {})
        // eslint-disable-next-line
    }, []) // Need to only be created on startup

    useEffect(() => {
        initHierarchy()

        // This should only run once on component load
        if (!searchInputState && params.id) {
            const newId = params.id.trim();
            setSearchInput(newId);
            (async () => await handleInput(newId))();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initHierarchy]) // Only need this to run once

    useEffect(()=>{
        if (selectedItem){
            navigate(`/search/${selectedItem.item._id}`)
        }
    },[selectedItem, navigate])

    useEffect(() => {
        if (searchInputState && searchInputState.match(/([a-z0-9]{24})/)) {
            handleIDInput(searchInputState)
        }
    }, [handleIDInput, searchInputState])

    const handleInput = useCallback(async (input: string) => {
        if (!input || input.length < searchThreshold || isbusy) {
            setSelectedItem(undefined)
            setSelecteOptions([])
            setIsBusy(false)
            return
        }
        setIsBusy(true)

        if (input.match(/([a-z0-9]{24})/)) await handleIDInput(input)
        else await handleNameInput(input)

        setIsBusy(false)
    }, [handleIDInput, handleNameInput, isbusy, setSelectedItem])

    const formatDisplayItems = () => {
        // If loading
        if (isbusy) return <CircularProgress size={100}/>

        // If finished loading
        if (selectedItem) {
            return (
                <ReactJson
                    src={selectedItem}
                    theme={preferedJsonViewerTheme}
                    style={{
                        marginTop: '2vh',
                        width: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                    }}
                />
            )
        } else return <Typography id='search-no-data'>No data to display</Typography>
    }

    const findOptionValue = (option: IItemOption, value: IItemOption): boolean => {
        return option.name?.toLocaleLowerCase() === value.name?.toLocaleLowerCase()
            || option.id?.toLocaleLowerCase() === value.id?.toLocaleLowerCase()
            || option.shortName?.toLocaleLowerCase() === value.shortName?.toLocaleLowerCase()
    }

    return (
        <Box className={classes.searchAreaHolder}>
            <Autocomplete
                id='search-autocomplete'
                options={selectOptions.map((elt) => ({name: elt.name, shortName: elt.shortName, id: elt.id}))}
                getOptionLabel={(option) => (option.name ? option.name : option.id) ?? ''}
                isOptionEqualToValue={(option, value) => findOptionValue(option, value)}
                open={!isbusy && searchInputState.length >= searchThreshold && (searchInputState !== selectedItem?.locale.Name && searchInputState !== selectedItem?.item._name)}
                className={classes.autocomplete}
                inputValue={searchInputState ? searchInputState : ''}
                onInputChange={async (evt: SyntheticEvent, newValue: string) => {
                    if (!evt) return
                    setSelectedItem(undefined)
                    setSearchInput(newValue)
                    await handleInput(newValue.trim())
                }}
                value={(() => {
                    const selectedOption = selectOptions.find(elt => elt.id === searchInputState || elt.name === searchInputState);
                    return selectedOption ? selectedOption : null;
                })()}
                onChange={async (event: SyntheticEvent, newValue: IItemOption | null) => {
                    if (newValue) {
                        const selectedOption = selectOptions.find(
                            (elt) => elt.id === newValue.id,
                        )
                        if (selectedOption) await handleIDInput(selectedOption.id)
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Search by name or ID"/>
                )}
                renderOption={(props, option ) => (
                    <li {...props} key={option.id}><Typography>{option.name}</Typography></li>
                )}
                filterOptions={(options, state) => options.filter(elt => {
                    return (elt.name?.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase())
                        || elt.id?.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase())
                        || elt.shortName?.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase()))
                })}
            />
            <Box className={classes.jsonHolder}>{formatDisplayItems()}</Box>
        </Box>
    )
}
