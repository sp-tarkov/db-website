import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavigationBreadcrumbs } from "@src/components/SearchPage/NavigationBreadcrumbs";
import { SearchArea } from "@src/components/SearchPage/SearchArea";

const SearchContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: 1,
  padding: "2vh 2vw 1vh 2vw"
}));

export const Search: React.FC = () => {
  return (
    <>
      <NavigationBreadcrumbs />
      <SearchContainer>
        <SearchArea />
      </SearchContainer>
    </>
  );
};
