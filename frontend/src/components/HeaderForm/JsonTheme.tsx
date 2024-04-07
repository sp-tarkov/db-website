import { ThemeKeys } from "@microlink/react-json-view";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useJsonViewerThemeStore } from "@src/store/json-viewer-theme";

const JsonThemeContainer = styled(Box)(() => ({
  display: "flex",
  flexGrow: 1,
  padding: "0 0.5vw 0 0.5vw"
}));

const JsonViewThemes = [
  "apathy",
  "apathy:inverted",
  "ashes",
  "bespin",
  "brewer",
  "bright:inverted",
  "bright",
  "chalk",
  "codeschool",
  "colors",
  "eighties",
  "embers",
  "flat",
  "google",
  "grayscale",
  "grayscale:inverted",
  "greenscreen",
  "harmonic",
  "hopscotch",
  "isotope",
  "marrakesh",
  "mocha",
  "monokai",
  "ocean",
  "paraiso",
  "pop",
  "railscasts",
  "rjv-default",
  "shapeshifter",
  "shapeshifter:inverted",
  "solarized",
  "summerfruit",
  "summerfruit:inverted",
  "threezerotwofour",
  "tomorrow",
  "tube",
  "twilight"
];

export const JsonTheme: React.FC = () => {
  const [themeMode, setThemeMode] = useJsonViewerThemeStore((state) => [state.themeMode, state.setThemeMode]);

  return (
    <JsonThemeContainer>
      <FormControl fullWidth variant="standard">
        <Select
          displayEmpty
          sx={{ display: "flex", flexGrow: 1 }}
          labelId="react-json-view-theme"
          value={themeMode}
          label="JSON theme"
          onChange={(event) => {
            setThemeMode(event.target.value as ThemeKeys)
          }}
          id="json-selector"
        >
          <MenuItem disabled value="">
            <em>JSON Theme</em>
          </MenuItem>
          {JsonViewThemes.map((theme) => (
            <MenuItem key={theme} value={theme}>
              {theme}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </JsonThemeContainer>
  );
};
