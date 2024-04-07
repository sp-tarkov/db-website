import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const FooterContainer = styled(Box)(() => ({
  display: "flex",
  flex: "0 1 3vh",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 10vw 0 10vw"
}));

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
    </FooterContainer>
  );
};
