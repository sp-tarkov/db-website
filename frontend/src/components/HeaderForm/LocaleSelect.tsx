import { useEffect } from "react";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocaleStore } from "@src/store/locale";
import { useLocalesListStore } from "@src/store/locales";

const LocaleContainer = styled(Box)(() => ({
  display: "flex",
  flexGrow: 1,
  padding: "0 0.5vw 0 0.5vw"
}));

export const LocaleSelect: React.FC = () => {

  const [preferedLocale, setPreferedLocale] = useLocaleStore((state) => [state.preferedLocale, state.setPreferedLocale]);
  const [localesList, refreshLocalesList] = useLocalesListStore((state) => [state.localesList, state.refreshLocalesList]);

  useEffect(() => {
    refreshLocalesList();
  }, [refreshLocalesList]);

  return (
    <LocaleContainer>
      <FormControl fullWidth variant="standard">
        <Select
          displayEmpty
          sx={{ display: "flex", flexGrow: 1 }}
          labelId="prefered-locale"
          value={localesList.length > 0 ? preferedLocale : ""}
          onChange={(evt) => {
            setPreferedLocale(evt.target.value)
          }}
          id="locale-selector"
        >
          <MenuItem disabled value="">
            <em>Language</em>
          </MenuItem>
          {localesList.map((locale) => (
            <MenuItem key={locale} value={locale}>
              {locale}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </LocaleContainer>
  );
};
