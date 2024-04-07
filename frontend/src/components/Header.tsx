import { Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HeaderForm } from "@src/components/HeaderForm";

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: "0 1 3vh",
  flexDirection: "row",
  backgroundColor: theme.palette.background.paper,
  alignItems: "center",
  padding: "0 10vw 0 10vw"
}));

const LinksContainer = styled(Box)(() => ({
  display: "flex",
  flexGrow: 2,
  flexDirection: "row",
  alignItems: "center",
  height: "100%"
}));

const FormContainer = styled(Box)(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "row",
  alignItems: "center",
  height: "100%"
}));

const CustomLink = styled(Link)(({ theme }) => ({
  display: "flex",
  padding: "0 1vw 0 1vw",
  height: "100%",
  alignItems: "center",
  borderBottom: `1px solid transparent`,
  "&:hover": {
    borderBottom: `1px solid ${theme.palette.action.hover}`
  }
}));

const links = [
  {
    id: "website-link",
    path: import.meta.env.VITE_SPTARKOV_HOME ?? "",
    label: "Website"
  },
  {
    id: "workshop-link",
    path: import.meta.env.VITE_SPTARKOV_WORKSHOP ?? "",
    label: "Workshop"
  },
  {
    id: "documentation-link",
    path: import.meta.env.VITE_SPTARKOV_DOCUMENTATION ?? "",
    label: "Documentation"
  }
];

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LinksContainer>
        {links.map((link) => (
          <CustomLink key={link.path} href={link.path} id={link.id} underline="hover" color="inherit">
            {link.label}
          </CustomLink>
        ))}
      </LinksContainer>
      <FormContainer>
        <HeaderForm />
      </FormContainer>
    </HeaderContainer>
  );
};
