import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactJson from "@microlink/react-json-view";
import { Autocomplete, Box, CircularProgress, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ItemOption } from "@src/dto/ItemOption";
import { useLocaleStore } from "@src/store/locale";
import { useJsonViewerThemeStore } from "@src/store/json-viewer-theme";
import { useSearchStore } from "@src/store/search";
import { useHierarchyStore } from "@src/store/hierarchy";
import { useSelectedItemStore } from "@src/store/selected-item";
import { getItem, getItemHierarchy, searchItem } from "@src/api/items";

const SearchAreaContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  background: theme.palette.background.paper,
  padding: "2vh 2vw 2vh 2vw"
}));

const JsonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
  flexDirection: "column",
  background: theme.palette.background.paper,
  maxHeight: "80vh"
}));

export const SearchArea: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [selectOptions, setSelectOptions] = useState<ItemOption[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const preferedLocale = useLocaleStore((state) => state.preferedLocale);
  const themeMode = useJsonViewerThemeStore((state) => state.themeMode);
  const [searchInput, setSearchInput] = useSearchStore((state) => [state.searchInput, state.setSearchInput]);
  const [setHierarchy, getCachedHierarchy] = useHierarchyStore((state) => [state.setHierarchy, state.getCachedHierarchy]);
  const [selectedItem, setSelectedItem] = useSelectedItemStore((state) => [state.selectedItem, state.setSelectedItem]);

  const searchTreshold = 3;

  const handleNameInput = useCallback(async (input: string) => {
    const searchResults = await searchItem(input, preferedLocale);

    console.log(searchResults);

    const options = searchResults.map((res): ItemOption => ({
      id: res.item._id,
      name: res.locale.Name ?? res.item._name,
      shortName: JSON.stringify(res.locale.ShortName)
    }));

    console.log(options);

    setSelectOptions(options);
  }, [preferedLocale]);

  const handleIDInput = useCallback(async (input: string) => {
    const itemJson = await getItem(input, preferedLocale);
    if(!itemJson) {
      setSelectedItem(undefined);
      setSearchInput("");
      return;
    }

    setSelectedItem(itemJson);
    const itemObj: ItemOption = {
      id: itemJson.item._id,
      name: itemJson.locale.Name ?? itemJson.item._name,
      shortName: itemJson.locale.ShortName
    };
    setSelectOptions([itemObj]);
    setSearchInput(itemObj.name);

    //Update hierarchy
    const cachedhierarchy = getCachedHierarchy(itemJson.item._id);

    if(cachedhierarchy) {
      setHierarchy(cachedhierarchy);
      return;
    }

    const itemHierarchy = await getItemHierarchy(itemJson.item, preferedLocale);
    setHierarchy(itemHierarchy ?? {});
    // eslint-disable-next-line
  }, []); // Need to only be created on startup

  useEffect(() => {
    (async () => {
      // This should only run once on component load
      if(!searchInput && params.id) {
        const newId = params.id.trim();
        setSearchInput(newId);
        await handleInput(newId);
      }
    })();
    // eslint-disable-next-line
  }, []); // Only need this to run once

  useEffect(() => {
    if(selectedItem) {
      navigate(`/search/${selectedItem.item._id}`);
    }
  }, [selectedItem, navigate]);

  useEffect(() => {
    if(searchInput && searchInput.match(/([a-z0-9]{24})/)) {
      handleIDInput(searchInput);
    }
  }, [handleIDInput, searchInput]);

  const handleInput = useCallback(async (input: string) => {
    if(!input || input.length < searchTreshold || isBusy) {
      setSelectedItem(undefined);
      setSelectOptions([]);
      setIsBusy(false);
      return;
    }

    setIsBusy(true);

    if(input.match(/([a-z0-9]{24})/)) {
      await handleIDInput(input);
    }else {
      await handleNameInput(input);
    }
    setIsBusy(false);
  }, [handleIDInput, handleNameInput, isBusy, setSelectedItem]);

  const formatDisplayItems = () => {
    // If loading
    if(isBusy) {
      return (
        <CircularProgress size={100} />
      );
    }

    // If finished loading
    if(selectedItem) {
      return (
        <ReactJson
          src={selectedItem}
          theme={themeMode}
          style={{
            marginTop: "2vh",
            width: "100%",
            overflowY: "auto",
            display: "flex"
          }}
        />
      );
    }else {
      return (
        <Typography id="search-no-data">No data to display</Typography>
      );
    }
  };

  const findOptionValue = (option: ItemOption, value: ItemOption): boolean => {
    return option.name.toLocaleLowerCase() === value.name.toLocaleLowerCase()
      || option.id.toLocaleLowerCase() === value.id.toLocaleLowerCase()
      || option.shortName?.toLocaleLowerCase() === value.shortName?.toLocaleLowerCase();
  };

  return (
    <SearchAreaContainer>
      <Autocomplete
        id="search-autocomplete"
        options={selectOptions}
        getOptionLabel={(option) => option.name ?? option.id ?? ""}
        isOptionEqualToValue={(option, value) => findOptionValue(option, value)}
        open={!isBusy && searchInput.length >= searchTreshold && (searchInput !== selectedItem?.locale.Name && searchInput !== selectedItem?.item._name)}
        inputValue={searchInput ?? ""}
        onInputChange={async (event: SyntheticEvent, newValue: string) => {
          if(!event) return;

          setSelectedItem(undefined);
          setSearchInput(newValue);
          await handleInput(newValue.trim());
        }}
        value={(() => {
          const selectedOption = selectOptions.find((option) => option.id === searchInput || option.name === searchInput);
          return selectedOption ?? null;
        })()}
        onChange={async (_, newValue: ItemOption | null) => {
          if(!newValue) return;

          const selectedOption = selectOptions.find((option) => option.id === newValue.id);

          if(!selectedOption) return;

          await handleIDInput(selectedOption.id);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search by name or ID" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Typography>{option.name}</Typography>
          </li>
        )}
        filterOptions={(options, state) => options.filter((option) => {
          return option.name.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase())
          || option.id.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase())
          || option.shortName?.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase());
        })}
      />
      <JsonContainer>{formatDisplayItems()}</JsonContainer>
    </SearchAreaContainer>
  );
};
