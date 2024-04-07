import { styled } from "@mui/material/styles";
import { ThemeToggle } from "@src/components/HeaderForm/ThemeToggle";
import { LocaleSelect } from "@src/components/HeaderForm/LocaleSelect";
import { JsonTheme } from "@src/components/HeaderForm/JsonTheme";

const CustomForm = styled("form")(() => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: 1,
  justifyContent: "flex-end",
  height: "100%"
}));

export const HeaderForm: React.FC = () => {
  return (
    <CustomForm>
      <ThemeToggle />
      <LocaleSelect />
      <JsonTheme />
    </CustomForm>
  );
};
