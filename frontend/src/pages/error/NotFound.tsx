import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavigationBreadcrumbs } from "@src/components/SearchPage/NavigationBreadcrumbs";

const SearchContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  flexGrow: 1,
  padding: "2vh 2vw 1vh 2vw"
}));

const SearchAreaContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  background: theme.palette.background.paper,
  padding: "2vh 2vw 2vh 2vw"
}));

const NotFoundContainer = styled(Box)(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
  paddingTop: "10vh"
}));

export const NotFound: React.FC = () => {
  return (
    <>
      <NavigationBreadcrumbs />
      <SearchContainer>
        <SearchAreaContainer>
          <NotFoundContainer>
            <Typography id="not-found-message" variant="h3">This page does not exist!</Typography>
          </NotFoundContainer>
        </SearchAreaContainer>
      </SearchContainer>
    </>
  );
};
