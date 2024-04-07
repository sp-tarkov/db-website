import { useEffect, useState } from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ItemComplete } from "@src/dto/ItemComplete";
import { useHierarchyStore } from "@src/store/hierarchy";
import { useSelectedItemStore } from "@src/store/selected-item";
import { useSearchStore } from "@src/store/search";

const BreadcrumbsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: "0 1 3vh",
  flexDirection: "row",
  alignItems: "center",
  padding: "0 10vw 0 10vw",
  borderBottom: `1px solid ${theme.palette.background.paper}`
}));

const CustomBreadcrumbs = styled(Breadcrumbs)(() => ({
  display: "flex",
  flex: "0 1 3vh",
  flexDirection: "row",
  flexGrow: 1
}));

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: "flex",
  padding: "0 1vw 0 1vw",
  height: "100%",
  alignItems: "center",
  borderBottom: `1px solid transparent`,
  "&:hover": {
    color: theme.palette.action.hover,
    cursor: "pointer"
  }
}));

const CurrentItem = styled(Typography)(({ theme }) => ({
  cursor: "default",
  borderBottom: `1px solid ${theme.palette.action.hover}`
}));

export const NavigationBreadcrumbs: React.FC = () => {
  const [currentHierarchy, setCurrentHierarchy] = useState<ItemComplete[]>([]);
  const [itemsHierarchy, getCachedHierarchy] = useHierarchyStore((state) => [state.itemsHierarchy, state.getCachedHierarchy]);
  const [selectedItem, setSelectedItem] = useSelectedItemStore((state) => [state.selectedItem, state.setSelectedItem]);
  const [searchInput, setSearchInput] = useSearchStore((state) => [state.searchInput, state.setSearchInput]);

  useEffect(() => {
    if(!selectedItem || !itemsHierarchy) return;

    const cachedHierarchy = getCachedHierarchy(selectedItem.item._id);

    if(!cachedHierarchy) return;

    setCurrentHierarchy(Object.values(cachedHierarchy).reverse());
  }, [selectedItem, itemsHierarchy, getCachedHierarchy]);

  const formatLink = (item: ItemComplete, idx: string) => {
    if([item.locale.Name, item.item._id, item.item._name].includes(searchInput)) {
      return (
        <CurrentItem key={item.item._id} variant="body2">
          {item.locale.Name ?? item.item._name}
        </CurrentItem>
      );
    }

    return (
      <CustomLink
        key={idx}
        underline="hover"
        color="inherit"
        onClick={() => {
          setSearchInput(item.item._id);
          setSelectedItem(undefined);
        }}>
          <Typography variant="body2">{item.locale.Name ?? item.item._name}</Typography>
      </CustomLink>
    );
  };

  return (
    <BreadcrumbsContainer>
      <CustomBreadcrumbs aria-label="breadcrumb" id="navigation-breadcrumb">
        <CustomLink key="home" id="home-breadcrumb" href="/" underline="hover" color="inherit">
          <Typography variant="body2">Home</Typography>
        </CustomLink>
        {currentHierarchy.map((item, idx) => formatLink(item, idx.toString()))}
      </CustomBreadcrumbs>
    </BreadcrumbsContainer>
  );
};
